import { Linkedin } from "lucide-react";
import { FaInstagram } from "react-icons/fa";
import travizLogo from "@assets/traviz_logo_no_background_1755634682120.png";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-charcoal py-12 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          <div><div className="mb-6 flex items-center space-x-2"><img src={travizLogo} alt="Traviz Logo" className="h-8 w-8" /><span className="text-xl font-bold">Traviz</span></div><p className="mb-6 leading-relaxed text-gray-300">Practical AI decisions, validated use cases and implementation plans for digital businesses.</p><div className="flex space-x-4"><a href="https://www.linkedin.com/company/traviz/" className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-700 transition-colors hover:bg-logo-purple" data-testid="footer-social-linkedin" target="_blank" rel="noopener noreferrer"><Linkedin className="h-5 w-5 text-white" /></a><a href="https://www.instagram.com/traviz.consulting" className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-700 transition-colors hover:bg-logo-purple" data-testid="footer-social-instagram" target="_blank" rel="noopener noreferrer"><FaInstagram className="h-5 w-5 text-white" /></a></div></div>
          <div><h4 className="mb-6 text-lg font-semibold">How Traviz works</h4><ul className="space-y-3 text-gray-300"><li><a href="#services" className="transition-colors hover:text-electric-teal">AI Opportunity & Data Readiness Sprint</a></li><li><a href="#services" className="transition-colors hover:text-electric-teal">Customer Intelligence and Retention AI</a></li><li><a href="#services" className="transition-colors hover:text-electric-teal">Workflow Automation and Agentic Operations</a></li><li><a href="#services" className="transition-colors hover:text-electric-teal">AI and Data Implementation Planning</a></li></ul></div>
          <div><h4 className="mb-6 text-lg font-semibold">Traviz</h4><ul className="space-y-3 text-gray-300"><li><a href="#about" className="transition-colors hover:text-electric-teal">About Traviz</a></li><li><a href="#case-studies" className="transition-colors hover:text-electric-teal">Experience & Proof</a></li><li><a href="#contact" className="transition-colors hover:text-electric-teal">Contact</a></li></ul></div>
        </div>
        <div className="mt-12 border-t border-gray-700 pt-8 text-center"><p className="text-gray-300">© {currentYear} Traviz. All rights reserved.</p><p className="mt-2 text-sm text-gray-400">Privacy and terms links will be added before release.</p></div>
      </div>
    </footer>
  );
}
