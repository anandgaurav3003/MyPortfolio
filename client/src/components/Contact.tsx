import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

export default function Contact() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const validateEmail = (email: string): boolean => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when field is edited
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const newErrors: FormErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    
    if (!formData.subject.trim()) {
      newErrors.subject = "Subject is required";
    }
    
    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    }
    
    if (Object.keys(newErrors).length === 0) {
      // Submit form to the server
      try {
        setIsSubmitting(true);
        
        const response = await apiRequest({
          url: "/api/contact",
          method: "POST",
          data: formData
        });
        
        setSubmitted(true);
        
        // Reset form
        setFormData({
          name: "",
          email: "",
          subject: "",
          message: ""
        });
        
        toast({
          title: "Success",
          description: "Your message has been sent successfully!",
        });
        
      } catch (error) {
        console.error("Error sending message:", error);
        toast({
          title: "Error",
          description: "Failed to send message. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <section id="contact" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold font-heading text-gray-800 mb-4">Get In Touch</h2>
          <div className="w-20 h-1 bg-primary mx-auto rounded-full"></div>
          <p className="text-gray-600 mt-4 max-w-xl mx-auto">
            I'm always open to new opportunities and collaborations. Feel free to reach out!
          </p>
        </div>
        
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <div className="bg-white shadow-lg rounded-lg p-6 md:p-8 max-w-md md:mr-auto">
              <h3 className="text-xl font-bold text-gray-800 mb-6">Contact Information</h3>
              
              <div className="flex items-start mb-6">
                <i className="fas fa-map-marker-alt text-primary mt-1 mr-4 w-5 text-center"></i>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-1">Location</h4>
                  <p className="text-gray-600">New Delhi, India</p>
                </div>
              </div>
              
              <div className="flex items-start mb-6">
                <i className="fas fa-envelope text-primary mt-1 mr-4 w-5 text-center"></i>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-1">Email</h4>
                  <a href="mailto:gaurav.anand@example.com" className="text-gray-600 hover:text-primary">gaurav.anand@example.com</a>
                </div>
              </div>
              
              <div className="flex items-start mb-6">
                <i className="fas fa-phone-alt text-primary mt-1 mr-4 w-5 text-center"></i>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-1">Phone</h4>
                  <a href="tel:+919876543210" className="text-gray-600 hover:text-primary">+91 98765 43210</a>
                </div>
              </div>
              
              <h4 className="font-semibold text-gray-800 mb-3 mt-8">Follow Me</h4>
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 rounded-full bg-[#1877F2] flex items-center justify-center text-white transition duration-300 hover:opacity-80">
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-[#1DA1F2] flex items-center justify-center text-white transition duration-300 hover:opacity-80">
                  <i className="fab fa-twitter"></i>
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-[#E4405F] flex items-center justify-center text-white transition duration-300 hover:opacity-80">
                  <i className="fab fa-instagram"></i>
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-[#0A66C2] flex items-center justify-center text-white transition duration-300 hover:opacity-80">
                  <i className="fab fa-linkedin-in"></i>
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-[#333333] flex items-center justify-center text-white transition duration-300 hover:opacity-80">
                  <i className="fab fa-github"></i>
                </a>
              </div>
            </div>
          </div>
          
          <div className="md:w-1/2">
            <div className="bg-white shadow-lg rounded-lg p-6 md:p-8 max-w-md md:ml-auto">
              <h3 className="text-xl font-bold text-gray-800 mb-6">Send a Message</h3>
              
              {submitted ? (
                <div className="p-4 mb-4 text-sm text-green-700 bg-green-100 rounded-lg">
                  Thank you! Your message has been sent successfully. I'll get back to you soon.
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label htmlFor="name" className="block text-gray-700 font-medium mb-2">Name</label>
                    <input 
                      type="text" 
                      id="name" 
                      name="name" 
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`}
                      placeholder="Your name" 
                    />
                    {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="email" className="block text-gray-700 font-medium mb-2">Email</label>
                    <input 
                      type="email" 
                      id="email" 
                      name="email" 
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`}
                      placeholder="Your email" 
                    />
                    {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="subject" className="block text-gray-700 font-medium mb-2">Subject</label>
                    <input 
                      type="text" 
                      id="subject" 
                      name="subject" 
                      value={formData.subject}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border ${errors.subject ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`}
                      placeholder="Subject" 
                    />
                    {errors.subject && <p className="mt-1 text-xs text-red-500">{errors.subject}</p>}
                  </div>
                  
                  <div className="mb-6">
                    <label htmlFor="message" className="block text-gray-700 font-medium mb-2">Message</label>
                    <textarea 
                      id="message" 
                      name="message" 
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border ${errors.message ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`}
                      placeholder="Your message" 
                    ></textarea>
                    {errors.message && <p className="mt-1 text-xs text-red-500">{errors.message}</p>}
                  </div>
                  
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full bg-primary hover:bg-blue-600 text-white font-medium py-3 rounded-lg transition duration-300 flex justify-center items-center"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending...
                      </>
                    ) : (
                      "Send Message"
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
