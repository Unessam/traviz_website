// Script to update production data
// Instructions:
// 1. Log in to your production site using Replit Auth
// 2. Open browser console (F12)
// 3. Copy and paste this entire script
// 4. Press Enter to run it

const API_BASE = window.location.origin;

async function updateProductionData() {
  console.log('🚀 Starting production data update...');

  try {
    // Update About/Founder Information
    console.log('📝 Updating founder information...');
    const aboutResponse = await fetch(`${API_BASE}/api/admin/about`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        story: 'At Traviz, we believe AI should serve business goals, not the other way around. Founded by Younes Sandi, an AI specialist with 7+ years of experience, we help companies move from "AI curiosity" to AI capability.',
        mission: 'To empower businesses with practical, impactful, and responsible AI automation that delivers measurable ROI.',
        philosophy: 'We focus on practical implementation over theoretical possibilities, ensuring every AI solution we develop serves a clear business purpose.',
        values: [
          "Innovation-Driven: We embrace cutting-edge AI while ensuring tangible value",
          "Integrity-Focused: Your success defines our success",
          "Impact-Oriented: We focus on results that matter",
          "Collaboration First: We work as part of your team from day one"
        ],
        founderName: 'Younes Sandi',
        founderBio: 'From predicting churn in gaming to building GenAI agents for healthcare, Younes has delivered solutions for startups, enterprises, and the public sector.',
        founderCredentials: [
          "AI Specialist",
          "Data Scientist",
          "ML Engineer",
          "7+ years of experience"
        ]
      })
    });

    if (aboutResponse.ok) {
      console.log('✅ Founder information updated successfully!');
    } else {
      console.error('❌ Failed to update founder information:', await aboutResponse.text());
    }

    // Get existing testimonials to delete them
    console.log('🔍 Fetching existing testimonials...');
    const testimonialsResponse = await fetch(`${API_BASE}/api/testimonials`);
    const existingTestimonials = await testimonialsResponse.json();
    
    console.log(`Found ${existingTestimonials.length} existing testimonials`);

    // Delete old testimonials
    for (const testimonial of existingTestimonials) {
      console.log(`🗑️  Deleting testimonial from ${testimonial.authorName}...`);
      await fetch(`${API_BASE}/api/admin/testimonials/${testimonial.id}`, {
        method: 'DELETE'
      });
    }

    // Add correct testimonials
    console.log('➕ Adding new testimonials...');
    
    const newTestimonials = [
      {
        content: 'Excellent communication and quality of work. Highly recommend!',
        authorName: 'Abbas Visanji',
        authorRole: 'Practice Owner',
        authorCompany: 'Magnolia Dental Practice',
        rating: 5,
        isActive: true
      },
      {
        content: 'Younes is easy to work with, knowledgeable, and provided a great end product.',
        authorName: 'HR & Business Services Team',
        authorRole: 'HR Department',
        authorCompany: 'TestGorilla B.V.',
        rating: 5,
        isActive: true
      }
    ];

    for (const testimonial of newTestimonials) {
      const response = await fetch(`${API_BASE}/api/admin/testimonials`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testimonial)
      });

      if (response.ok) {
        console.log(`✅ Added testimonial from ${testimonial.authorName}`);
      } else {
        console.error(`❌ Failed to add testimonial from ${testimonial.authorName}:`, await response.text());
      }
    }

    console.log('🎉 Production data update completed!');
    console.log('🔄 Refresh the page to see the changes.');

  } catch (error) {
    console.error('❌ Error updating production data:', error);
  }
}

// Run the update
updateProductionData();
