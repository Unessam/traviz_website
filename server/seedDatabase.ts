import { db } from "./db";
import * as schema from "@shared/schema";
import { eq, sql } from "drizzle-orm";

export async function seedDatabaseIfEmpty() {
  try {
    console.log("🌱 Checking if database needs seeding...");

    // Check if about content exists
    const existingAbout = await db.select().from(schema.aboutContent).limit(1);
    
    if (existingAbout.length === 0) {
      console.log("📝 Seeding about content...");
      await db.insert(schema.aboutContent).values({
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
      });
      console.log("✅ About content seeded");
    } else {
      // Update existing about content to ensure founder name is correct
      console.log("🔄 Updating existing about content...");
      await db.update(schema.aboutContent)
        .set({
          founderName: 'Younes Sandi',
          story: 'At Traviz, we believe AI should serve business goals, not the other way around. Founded by Younes Sandi, an AI specialist with 7+ years of experience, we help companies move from "AI curiosity" to AI capability.',
        })
        .where(sql`true`);
      console.log("✅ About content updated");
    }

    // Check and seed testimonials
    const existingTestimonials = await db.select().from(schema.testimonials);
    const correctTestimonialNames = ['Abbas Visanji', 'HR & Business Services Team'];
    
    // Check if we have the correct testimonials
    const hasCorrectTestimonials = correctTestimonialNames.every(name =>
      existingTestimonials.some(t => t.authorName === name)
    );

    if (!hasCorrectTestimonials) {
      console.log("📝 Updating testimonials...");
      
      // Delete all existing testimonials
      await db.delete(schema.testimonials).where(sql`true`);
      
      // Add correct testimonials
      await db.insert(schema.testimonials).values([
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
      ]);
      console.log("✅ Testimonials seeded");
    }

    // Seed hero content if missing
    const existingHero = await db.select().from(schema.heroContent).limit(1);
    if (existingHero.length === 0) {
      console.log("📝 Seeding hero content...");
      await db.insert(schema.heroContent).values({
        title: 'AI Automation That Delivers Real Business Impact',
        subtitle: 'We\'re not just consultants — we\'re your AI partners, guiding you from the first idea to real-world implementation.',
        description: 'From strategy to deployment, Traviz helps you harness the power of AI to automate workflows, build intelligent agents, and drive measurable results.',
        primaryButtonText: 'Book a Consultation',
        secondaryButtonText: 'Learn More'
      });
      console.log("✅ Hero content seeded");
    }

    // Seed stats if missing
    const existingStats = await db.select().from(schema.stats).limit(1);
    if (existingStats.length === 0) {
      console.log("📝 Seeding stats...");
      await db.insert(schema.stats).values({
        hoursSaved: 1000,
        clientsServed: 50,
        roiIncrease: 300,
        projectsCompleted: 100,
        yearsExperience: 7,
        hoursSavedAnnually: 1000,
        industryProjectsCount: 'Multiple'
      });
      console.log("✅ Stats seeded");
    }

    // Seed services if missing
    const existingServices = await db.select().from(schema.services).limit(1);
    if (existingServices.length === 0) {
      console.log("📝 Seeding services...");
      await db.insert(schema.services).values([
        {
          title: 'AI Strategy & Consultation',
          description: 'Turn AI from a buzzword into a measurable business asset. We identify high-impact AI opportunities, align them with your strategic goals, and deliver a clear roadmap to implementation.',
          features: [
            "AI strategy roadmap tailored to your business objectives",
            "ROI-focused recommendations backed by data",
            "Feasibility studies and proof-of-concept plans",
            "Executive-ready strategy documents for stakeholder buy-in"
          ],
          useCases: 'Defining an AI adoption strategy for a healthcare network. Identifying automation opportunities in a global logistics company. Evaluating AI ROI for a SaaS startup before product launch.',
          icon: 'Brain',
          order: 1,
          isActive: true
        },
        {
          title: 'Automation & AI Integration',
          description: 'Integrate intelligent automation into your workflows to save time, reduce costs, and eliminate human error. We build and integrate AI-powered agents and automation tools directly into your operations.',
          features: [
            "Custom AI agent development (chat, voice, or multi-modal)",
            "Seamless integration with CRMs, ERPs, and communication platforms",
            "Automation of repetitive workflows and back-office tasks",
            "Ongoing performance monitoring and optimization"
          ],
          useCases: 'AI receptionist handling patient bookings in a dental practice. Generative AI system summarizing sales calls and generating proposals. Automating customer support ticket triage for an e-commerce brand.',
          icon: 'Cog',
          order: 2,
          isActive: true
        },
        {
          title: 'Machine Learning & Engineering',
          description: 'From predictive analytics to anomaly detection, we build custom ML models that solve your most complex challenges. Our solutions go beyond experimentation — we design for production.',
          features: [
            "End-to-end ML model development and deployment",
            "MLOps pipelines for continuous delivery and improvement",
            "Real-time prediction and decision-support systems",
            "Explainable AI for transparency and compliance"
          ],
          useCases: 'Predicting churn in gaming and recommending personalized bonuses. Fraud detection models for online financial transactions. Predictive maintenance for heavy machinery.',
          icon: 'TrendingUp',
          order: 3,
          isActive: true
        },
        {
          title: 'Data Engineering & Science',
          description: 'Transform raw data into actionable intelligence. We design scalable data architectures and deliver insights that drive smarter decisions.',
          features: [
            "Scalable data infrastructure and cloud architecture",
            "Automated data ingestion, cleaning, and transformation pipelines",
            "Advanced analytics and interactive dashboards",
            "Predictive and prescriptive modeling"
          ],
          useCases: 'Building a cloud-based data warehouse for an airline. Creating real-time dashboards for a retail chain. Developing forecasting models for supply chain optimization.',
          icon: 'Database',
          order: 4,
          isActive: true
        },
        {
          title: 'AI Product Development',
          description: 'Turn prototypes into market-ready AI products. We provide the technical leadership and engineering expertise to take your AI product from idea to launch.',
          features: [
            "End-to-end product design, development, and deployment",
            "Integration of AI/ML capabilities into product features",
            "Scalability planning and infrastructure setup",
            "Continuous product iteration and performance optimization"
          ],
          useCases: 'Developing an AI-powered CRM from concept to live product. Building a recommendation engine for an e-learning platform. Creating an AI-based analytics tool for the healthcare industry.',
          icon: 'Rocket',
          order: 5,
          isActive: true
        }
      ]);
      console.log("✅ Services seeded");
    }

    // Seed products if missing
    const existingProducts = await db.select().from(schema.products).limit(1);
    if (existingProducts.length === 0) {
      console.log("📝 Seeding products...");
      await db.insert(schema.products).values({
        name: 'Agentiq AI',
        description: 'Agentiq AI is a next-generation CRM system that transforms client relationship management with intelligent, always-on AI voice agents. Designed for businesses and agencies, it automates both inbound and outbound communication across the entire customer lifecycle—appointment scheduling, lead generation, payment collection, reactivation calls, FAQs, reservations, and more. With built-in analytics, multi-tenant support, and seamless CRM integrations, Agentiq AI helps teams streamline operations, boost efficiency, and engage customers at scale.',
        features: [
          "24/7 AI Voice Automation – Real-time, natural-sounding voice agents handle calls, reminders, follow-ups, and customer inquiries around the clock, ensuring no missed opportunities.",
          "Full Customer Lifecycle Coverage – From lead generation to payment collection, Agentiq automates every touchpoint, reducing manual workload and improving customer satisfaction.",
          "Multi-Tenant CRM Platform – Built for agencies and enterprise teams, securely manage multiple clients and workflows in one centralized system.",
          "Analytics & Sentiment Intelligence – Gain insights with transcripts, call sentiment analysis, lead tracking, and performance dashboards to optimize customer engagement."
        ],
        websiteUrl: 'https://agentiq.ai',
        isActive: true
      });
      console.log("✅ Products seeded");
    }

    // Seed case studies if missing
    const existingCaseStudies = await db.select().from(schema.caseStudies).limit(1);
    if (existingCaseStudies.length === 0) {
      console.log("📝 Seeding case studies...");
      await db.insert(schema.caseStudies).values([
        {
          title: 'Real-Time Churn Prediction & Bonus Recommendation',
          client: 'Leading Sports Betting Platform',
          industry: 'iGaming & Sports Betting',
          challenge: 'Bookmakers faced high churn rates in a competitive, non-contractual market, with limited visibility into early warning signals.',
          solution: 'Deployed a real-time churn prediction model with bonus recommendation logic, integrating with customer engagement workflows.',
          results: 'Improved customer retention and lifetime value through predictive insights and personalized engagement.',
          metrics: {
            cltvIncrease: "5%",
            churnReduction: "23%"
          },
          isActive: true
        },
        {
          title: 'Predictive Maintenance for Heavy Machinery',
          client: 'Machinery Distributor',
          industry: 'Supply Chain & Logistics',
          challenge: 'Manual maintenance schedules caused costly delays, inefficient warehousing, and unnecessary shipping expenses.',
          solution: 'Deployed a Random Forest model predicting machinery failures, enabling proactive parts management and delivery.',
          results: 'Boosted operational efficiency, reduced costs, and improved delivery timelines with AI-powered predictive maintenance.',
          metrics: {
            deliveryImprovement: "2.5 Days Faster",
            warehousingReduction: "19%"
          },
          isActive: true
        },
        {
          title: 'AI-Powered Data Migration & Modernization',
          client: 'Global Airline',
          industry: 'Aviation',
          challenge: 'Legacy migration processes were inefficient, error-prone, and lacked scalability for growing aviation data needs.',
          solution: 'Implemented a GenAI-powered migration toolset integrated with the airline\'s infrastructure, optimizing workflows and ensuring scalability.',
          results: 'Modernized data systems with AI automation, improving efficiency and laying the foundation for long-term growth.',
          metrics: {
            savedPerDay: "£ 5000/day",
            migrationSpeed: "3x Faster"
          },
          isActive: true
        },
        {
          title: 'Anomaly Detection for Risky Player Behavior',
          client: 'Gaming Platform Operator',
          industry: 'iGaming & Sports Betting',
          challenge: 'Operators needed to detect risky players faster while reducing false positives that harmed customer experience.',
          solution: 'Built a big-data powered anomaly detection engine using clustering and Gaussian Mixture Models, integrated into CRM workflows.',
          results: 'Improved customer safety, increased satisfaction, and enhanced CRM efficiency with earlier and more accurate detection.',
          metrics: {
            detectionAccuracy: "95%",
            falseAlarmReduction: "30%"
          },
          isActive: true
        }
      ]);
      console.log("✅ Case studies seeded");
    }

    console.log("✅ Database seeding completed!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    // Don't throw - allow app to continue even if seeding fails
  }
}
