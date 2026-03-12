import { useParams } from 'react-router';
import { motion } from 'motion/react';

export default function Legal() {
  const { topic } = useParams();

  let title = '';
  let content = [];

  switch (topic) {
    case 'privacy':
      title = 'Privacy Policy';
      content = [
        'At Golden Trip, we take your privacy seriously. This privacy policy describes how and why we obtain, store, and process data which can identify you.',
        'We may update this policy from time to time and shall indicate on the web site when changes have been made.',
        'We only collect information that is necessary to provide you with the services you have requested. This may include your name, contact details, payment information, and passport/visa requirements.',
        'Golden Trip does not share your data with unauthorized third parties. Data is only shared with our trusted partners when required to process your bookings, flights, or visas.'
      ];
      break;
    case 'terms':
      title = 'Terms of Service';
      content = [
        'Welcome to Golden Trip. By accessing our website and using our services, you agree to comply with and be bound by the following terms and conditions.',
        'All bookings made through Golden Trip are subject to availability and the terms and conditions outlined by specific travel providers, airlines, and hotels.',
        'You are responsible for ensuring that all information provided during the booking process is accurate and complete. Any errors may result in additional fees or cancellation of your booking.',
        'Golden Trip reserves the right to modify these terms of service at any time without prior notice.'
      ];
      break;
    case 'cookies':
      title = 'Cookie Policy';
      content = [
        'Golden Trip uses cookies to improve your experience on our website. Cookies are small text files that are placed on your device to help the site provide a better user experience.',
        'In general, cookies are used to retain user preferences, store information for things like shopping carts, and provide anonymized tracking data to third party applications like Google Analytics.',
        'You may prefer to disable cookies on this site and on others. The most effective way to do this is to disable cookies in your browser.',
        'Please note that disabling cookies may affect the functionality of this and many other websites that you visit.'
      ];
      break;
    case 'refund':
      title = 'Refund Policy';
      content = [
        'Our refund policy varies depending on the type of service booked and the specific terms of the travel providers involved.',
        'For visa application fees, refunds are generally not possible once the application has been submitted to the respective embassy or consulate, regardless of the outcome.',
        'For travel packages and flights, cancellations made within standard timeframes may be eligible for a partial or full refund, subject to administrative fees and airline policies.',
        'Please review the specific cancellation and refund terms provided at the time of your booking. If you have any questions, contact our support team.'
      ];
      break;
    default:
      title = 'Legal Information';
      content = ['Information not found. Please select a valid legal topic.'];
  }

  return (
    <div className="min-h-screen pt-20 pb-12 bg-gray-50 flex flex-col items-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl bg-white p-10 mt-10 rounded-2xl shadow-sm border border-gray-100"
      >
        <h1 className="text-4xl font-bold mb-8 pb-4 border-b border-gray-100" style={{ color: 'var(--navy)' }}>
          {title}
        </h1>
        <div className="space-y-6 text-gray-700 leading-relaxed text-lg">
          {content.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
