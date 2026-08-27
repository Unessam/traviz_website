// Synthetic-only unit tests for retention logic
import { describe, it, before } from 'node:test';
import assert from 'node:assert';
import {
  isContactSubmissionEligibleForDeletion,
  isOAuthUserEligibleForAnonymisation,
  CONTACT_RETENTION_MONTHS,
  OAUTH_ANONYMISE_DAYS,
} from './retention';
import { createContactNotifier, type PostmarkClient } from './contactNotification';

describe('Retention Logic', () => {
  describe('isContactSubmissionEligibleForDeletion', () => {
    it('should return true for contact submission past 12 months cutoff', () => {
      const createdAt = new Date();
      createdAt.setMonth(createdAt.getMonth() - (CONTACT_RETENTION_MONTHS + 1));
      const referenceTime = new Date();

      const result = isContactSubmissionEligibleForDeletion(
        { createdAt, legalHold: false },
        referenceTime
      );

      assert.strictEqual(result, true);
    });

    it('should return false for contact submission under legal hold', () => {
      const createdAt = new Date();
      createdAt.setMonth(createdAt.getMonth() - (CONTACT_RETENTION_MONTHS + 1));
      const referenceTime = new Date();

      const result = isContactSubmissionEligibleForDeletion(
        { createdAt, legalHold: true },
        referenceTime
      );

      assert.strictEqual(result, false);
    });

    it('should return false for contact submission with missing createdAt', () => {
      const referenceTime = new Date();

      const result = isContactSubmissionEligibleForDeletion(
        { createdAt: null, legalHold: false },
        referenceTime
      );

      assert.strictEqual(result, false);
    });

    it('should return false for contact submission within 12 months', () => {
      const createdAt = new Date();
      createdAt.setMonth(createdAt.getMonth() - (CONTACT_RETENTION_MONTHS - 1));
      const referenceTime = new Date();

      const result = isContactSubmissionEligibleForDeletion(
        { createdAt, legalHold: false },
        referenceTime
      );

      assert.strictEqual(result, false);
    });

    it('should throw for invalid referenceTime (not a Date)', () => {
      assert.throws(() => {
        isContactSubmissionEligibleForDeletion(
          { createdAt: new Date(), legalHold: false },
          'invalid' as any
        );
      }, /referenceTime must be a valid Date/);
    });

    it('should throw for future referenceTime', () => {
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 1);

      assert.throws(
        () => {
          isContactSubmissionEligibleForDeletion(
            { createdAt: new Date(), legalHold: false },
            futureDate
          );
        },
        /referenceTime cannot be in the future/
      );
    });
  });

  describe('isOAuthUserEligibleForAnonymisation', () => {
    it('should return true for user past 90 days cutoff with access removed', () => {
      const accessRemovedAt = new Date();
      accessRemovedAt.setDate(accessRemovedAt.getDate() - (OAUTH_ANONYMISE_DAYS + 1));
      const referenceTime = new Date();

      const result = isOAuthUserEligibleForAnonymisation(
        { accessRemovedAt, legalHold: false, retentionActionAt: null },
        referenceTime
      );

      assert.strictEqual(result, true);
    });

    it('should return false for user under legal hold', () => {
      const accessRemovedAt = new Date();
      accessRemovedAt.setDate(accessRemovedAt.getDate() - (OAUTH_ANONYMISE_DAYS + 1));
      const referenceTime = new Date();

      const result = isOAuthUserEligibleForAnonymisation(
        { accessRemovedAt, legalHold: true, retentionActionAt: null },
        referenceTime
      );

      assert.strictEqual(result, false);
    });

    it('should return false for user with missing accessRemovedAt', () => {
      const referenceTime = new Date();

      const result = isOAuthUserEligibleForAnonymisation(
        { accessRemovedAt: null, legalHold: false, retentionActionAt: null },
        referenceTime
      );

      assert.strictEqual(result, false);
    });

    it('should return false for user already actioned (retentionActionAt set)', () => {
      const accessRemovedAt = new Date();
      accessRemovedAt.setDate(accessRemovedAt.getDate() - (OAUTH_ANONYMISE_DAYS + 1));
      const referenceTime = new Date();

      const result = isOAuthUserEligibleForAnonymisation(
        { accessRemovedAt, legalHold: false, retentionActionAt: new Date() },
        referenceTime
      );

      assert.strictEqual(result, false);
    });

    it('should return false for user within 90 days', () => {
      const accessRemovedAt = new Date();
      accessRemovedAt.setDate(accessRemovedAt.getDate() - (OAUTH_ANONYMISE_DAYS - 1));
      const referenceTime = new Date();

      const result = isOAuthUserEligibleForAnonymisation(
        { accessRemovedAt, legalHold: false, retentionActionAt: null },
        referenceTime
      );

      assert.strictEqual(result, false);
    });

    it('should throw for invalid referenceTime (not a Date)', () => {
      assert.throws(() => {
        isOAuthUserEligibleForAnonymisation(
          { accessRemovedAt: new Date(), legalHold: false, retentionActionAt: null },
          'invalid' as any
        );
      }, /referenceTime must be a valid Date/);
    });

    it('should throw for future referenceTime', () => {
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 1);

      assert.throws(
        () => {
          isOAuthUserEligibleForAnonymisation(
            { accessRemovedAt: new Date(), legalHold: false, retentionActionAt: null },
            futureDate
          );
        },
        /referenceTime cannot be in the future/
      );
    });
  });
});

describe('Contact Notification', () => {
  it('should return success via fake client', async () => {
    let sendCalled = false;
    const fakeClient: PostmarkClient = {
      sendEmail: async () => {
        sendCalled = true;
      }
    };

    const notifier = createContactNotifier(
      {
        POSTMARK_API_KEY: 'test-key',
        POSTMARK_FROM_EMAIL: 'from@test.com',
        POSTMARK_TO_EMAIL: 'to@test.com'
      },
      fakeClient
    );

    const result = await notifier.notify({
      name: 'Test User',
      email: 'test@example.com',
      message: 'Test message'
    });

    assert.strictEqual(result.success, true);
    assert.strictEqual(result.configured, true);
    assert.strictEqual(sendCalled, true);
  });

  it('should return failed result on client error', async () => {
    const fakeClient = {
      sendEmail: async () => {
        throw new Error('Provider error');
      }
    };

    const notifier = createContactNotifier(
      {
        POSTMARK_API_KEY: 'test-key',
        POSTMARK_FROM_EMAIL: 'from@test.com',
        POSTMARK_TO_EMAIL: 'to@test.com'
      },
      fakeClient
    );

    const result = await notifier.notify({
      name: 'Test User',
      email: 'test@example.com',
      message: 'Test message'
    });

    assert.strictEqual(result.success, false);
    assert.strictEqual(result.configured, true);
  });

  it('should be no-op when unconfigured', async () => {
    const notifier = createContactNotifier(
      {
        POSTMARK_API_KEY: undefined,
        POSTMARK_FROM_EMAIL: 'from@test.com',
        POSTMARK_TO_EMAIL: 'to@test.com'
      }
    );

    const result = await notifier.notify({
      name: 'Test User',
      email: 'test@example.com',
      message: 'Test message'
    });

    assert.strictEqual(result.success, false);
    assert.strictEqual(result.configured, false);
  });

  it('should return failed result when configured but no client provided', async () => {
    const notifier = createContactNotifier(
      {
        POSTMARK_API_KEY: 'test-key',
        POSTMARK_FROM_EMAIL: 'from@test.com',
        POSTMARK_TO_EMAIL: 'to@test.com'
      },
      null
    );

    const result = await notifier.notify({
      name: 'Test User',
      email: 'test@example.com',
      message: 'Test message'
    });

    assert.strictEqual(result.success, false);
    assert.strictEqual(result.configured, true);
  });
});
