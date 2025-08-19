import React from "react";
import { Linkedin } from "lucide-react";
import { FaInstagram } from "react-icons/fa";
import travizLogo from "@assets/traviz_logo_no_background_1755634682120.png";



export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-charcoal text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-6">
              <img 
                src={travizLogo}
                alt="Traviz Logo"
                className="w-8 h-8"
              />
              <span className="text-xl font-bold">Traviz</span>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Transforming businesses through intelligent AI automation and cutting-edge technology solutions.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://www.linkedin.com/company/traviz/" 
                className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center hover:bg-logo-purple transition-colors"
                data-testid="footer-social-linkedin"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Linkedin className="w-5 h-5 text-white" />
              </a>
              <a 
                href="https://www.instagram.com/traviz.consulting" 
                className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center hover:bg-logo-purple transition-colors"
                data-testid="footer-social-instagram"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaInstagram className="w-5 h-5 text-white" />
              </a>
            </div>
          </div>
          
          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Services</h4>
            <ul className="space-y-3">
              <li>
                <a 
                  href="#services" 
                  className="text-gray-300 hover:text-electric-teal transition-colors"
                  data-testid="footer-link-ai-strategy"
                >
                  AI Strategy
                </a>
              </li>
              <li>
                <a 
                  href="#services" 
                  className="text-gray-300 hover:text-electric-teal transition-colors"
                  data-testid="footer-link-automation"
                >
                  Automation
                </a>
              </li>
              <li>
                <a 
                  href="#services" 
                  className="text-gray-300 hover:text-electric-teal transition-colors"
                  data-testid="footer-link-machine-learning"
                >
                  Machine Learning
                </a>
              </li>
              <li>
                <a 
                  href="#services" 
                  className="text-gray-300 hover:text-electric-teal transition-colors"
                  data-testid="footer-link-data-engineering"
                >
                  Data Engineering
                </a>
              </li>
              <li>
                <a 
                  href="#services" 
                  className="text-gray-300 hover:text-electric-teal transition-colors"
                  data-testid="footer-link-product-development"
                >
                  Product Development
                </a>
              </li>
            </ul>
          </div>
          
          {/* Company */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Company</h4>
            <ul className="space-y-3">
              <li>
                <a 
                  href="#about" 
                  className="text-gray-300 hover:text-electric-teal transition-colors"
                  data-testid="footer-link-about"
                >
                  About Us
                </a>
              </li>
              <li>
                <a 
                  href="#case-studies" 
                  className="text-gray-300 hover:text-electric-teal transition-colors"
                  data-testid="footer-link-case-studies"
                >
                  Case Studies
                </a>
              </li>
              <li>
                <a 
                  href="#insights" 
                  className="text-gray-300 hover:text-electric-teal transition-colors"
                  data-testid="footer-link-insights"
                >
                  Insights
                </a>
              </li>
              <li>
                <a 
                  href="#resources" 
                  className="text-gray-300 hover:text-electric-teal transition-colors"
                  data-testid="footer-link-resources"
                >
                  Resources
                </a>
              </li>
              <li>
                <a 
                  href="#contact" 
                  className="text-gray-300 hover:text-electric-teal transition-colors"
                  data-testid="footer-link-contact"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-12 pt-8 text-center">
          <p className="text-gray-300">
            &copy; {currentYear} Traviz. All rights reserved. | 
            <a href="#" className="text-electric-teal hover:text-logo-purple transition-colors ml-1">
              Privacy Policy
            </a> | 
            <a href="#" className="text-electric-teal hover:text-logo-purple transition-colors ml-1">
              Terms of Service
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
