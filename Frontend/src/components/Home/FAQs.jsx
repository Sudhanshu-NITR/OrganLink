import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const AccordionItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mb-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between bg-[#fff4ec] p-6 shadow-md hover:shadow-lg transition-all duration-300 ${isOpen? "rounded-t-lg":"rounded-lg"}`}
      >
        <span className="font-serif text-xl text-[#646c3c] text-left">{question}</span>
        <ChevronDown
          className={`text-[#646c3c] transition-transform duration-300 ${
            isOpen ? 'transform rotate-180' : ''
          }`}
          size={24}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 shadow-md rounded-b-lg ${
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="bg-[#fff4ec] px-6 pb-6 rounded-b-lg shadow-md">
          <p className="font-serif text-lg leading-relaxed text-gray-700">{answer}</p>
        </div>
      </div>
    </div>
  );
};


const FAQSection = () => {
  const faqs = [
    {
      question: "How does the organ matching process work?",
      answer: "Our system uses advanced algorithms to match donors with recipients based on multiple criteria including blood type, medical urgency, organ type and age. The matching process is automated but overseen by medical professionals to ensure optimal outcomes."
    },
    {
      question: "What organs and tissues can be donated?",
      answer: "Common organs that can be donated include kidneys, heart, liver, lungs, pancreas, and intestines. Tissues that can be donated include corneas, skin, heart valves, bones, blood vessels, and connective tissues. One donor can potentially save up to eight lives through organ donation and enhance the lives of up to 75 people through tissue donation."
    },
    {
      question: "How long does the matching process typically take?",
      answer: "The initial matching process is nearly instantaneous through our digital platform. However, the complete process, including medical evaluation and logistics coordination, typically takes 24-48 hours."
    },
    {
      question: "What are the requirements for hospitals to participate?",
      answer: "Participating hospitals must be licensed healthcare facilities, have appropriate organ transplant certifications, and maintain 24/7 transplant coordination capabilities. We also require hospitals to have dedicated staff for organ donation coordination."
    },
    // {
    //   question: "How do you ensure data security and privacy?",
    //   answer: "We maintain strict HIPAA compliance and use state-of-the-art encryption for all data transmission and storage. Our platform undergoes regular security audits, and access to sensitive information is strictly controlled through multi-factor authentication and role-based permissions."
    // }
  ];


  return (
    <div id="FAQs" className="py-20 bg-white">
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
        >
            <h2 className="text-6xl font-serif text-[#da7224]">Frequently Asked Questions</h2>
            <div className="w-24 h-1 bg-[#646c3c] mx-auto mt-6"></div>
        </motion.div>
        <div className="max-w-3xl mx-auto px-4">
            <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
            >
            {faqs.map((faq, index) => (
                <AccordionItem
                key={index}
                question={faq.question}
                answer={faq.answer}
                />
            ))}
            </motion.div>
        </div>
    </div>
  );
};

export default FAQSection;