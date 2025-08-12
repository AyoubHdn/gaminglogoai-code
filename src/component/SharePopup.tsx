// src/component/SharePopup.tsx
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { FaTwitter, FaDiscord, FaRedditAlien, FaFacebook, FaWhatsapp, FaEnvelope, FaLink, FaTimes } from 'react-icons/fa';

interface SharePopupProps {
  imageUrl: string;
  imageAlt: string;
  defaultText?: string; // Optional: "Check out this logo..."
  siteUrl: string; // e.g., https://gaminglogoai.com
  generatorUrl: string; // e.g., /gaming-logo-maker or /face-logo-generator
  onClose: () => void;
}

export const SharePopup: React.FC<SharePopupProps> = ({
  imageUrl,
  imageAlt,
  defaultText = "Check out this awesome AI-generated gaming logo!",
  siteUrl,
  generatorUrl,
  onClose,
}) => {
  const [shareText, setShareText] = useState(defaultText);
  const [linkCopied, setLinkCopied] = useState(false);

    // Define siteName and shareTitle inside or pass as props
   const siteName = "GamingLogoAI"; // Or pass as prop
   const shareTitle = "My Awesome Gaming Logo from GamingLogoAI!";

  const fullGeneratorUrl = `${siteUrl}${generatorUrl}`;
  const textToShare = `${shareText} Create yours at ${siteName}! ${fullGeneratorUrl} #GamingLogoAI`; // siteName needs to be passed or defined
  const textToShareWithImage = `${shareText} See it: ${imageUrl} Create yours at ${siteName}! ${fullGeneratorUrl} #GamingLogoAI`;

  const socialPlatforms = [
    { name: 'Twitter', icon: <FaTwitter />, color: "bg-sky-500 hover:bg-sky-600", shareUrl: `https://twitter.com/intent/tweet?text=${encodeURIComponent(textToShareWithImage)}&url=${encodeURIComponent(imageUrl)}` }, // Twitter often prefers text + image URL
    { name: 'Reddit', icon: <FaRedditAlien />, color: "bg-orange-500 hover:bg-orange-600", shareUrl: `https://www.reddit.com/submit?url=${encodeURIComponent(imageUrl)}&title=${encodeURIComponent(shareTitle)}` }, // shareTitle needs to be defined
    { name: 'Facebook', icon: <FaFacebook />, color: "bg-blue-700 hover:bg-blue-800", shareUrl: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(imageUrl)}"e=${encodeURIComponent(textToShare)}` },
    { name: 'WhatsApp', icon: <FaWhatsapp />, color: "bg-green-500 hover:bg-green-600", shareUrl: `https://api.whatsapp.com/send?text=${encodeURIComponent(textToShareWithImage)}` },
    { name: 'Email', icon: <FaEnvelope />, color: "bg-slate-500 hover:bg-slate-600", shareUrl: `mailto:?subject=${encodeURIComponent(shareTitle)}&body=${encodeURIComponent(textToShareWithImage)}` },
  ];
 


  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(imageUrl);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy link:", err);
      alert("Failed to copy link.");
    }
  };

  // Close on Escape key
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 transition-opacity duration-300 ease-in-out" onClick={onClose}>
      <div
        className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl p-6 w-full max-w-md transform transition-all duration-300 ease-in-out scale-100"
        onClick={(e) => e.stopPropagation()} // Prevent click inside from closing
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-slate-800 dark:text-white">Share Your Logo!</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200" aria-label="Close share popup">
            <FaTimes size={20} />
          </button>
        </div>

        <div className="mb-4 rounded-lg overflow-hidden aspect-square relative bg-slate-200 dark:bg-slate-700">
          <Image src={imageUrl} alt={imageAlt} layout="fill" objectFit="contain" unoptimized={true}/>
        </div>

        <textarea
          value={shareText}
          onChange={(e) => setShareText(e.target.value)}
          rows={3}
          className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md mb-4 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 focus:ring-purple-500 dark:focus:ring-cyan-500 focus:border-transparent text-sm"
          placeholder="Add a caption..."
        />

        <div className="grid grid-cols-3 gap-3 mb-4">
          {socialPlatforms.map(platform => (
            <a
              key={platform.name}
              href={platform.shareUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex flex-col items-center justify-center p-3 rounded-lg text-white text-xs sm:text-sm font-medium transition-transform hover:scale-105 ${platform.color}`}
              title={`Share on ${platform.name}`}
            >
              <span className="text-2xl sm:text-3xl mb-1">{platform.icon}</span>
              {platform.name}
            </a>
          ))}
        </div>

        <div className="flex items-center border border-slate-300 dark:border-slate-600 rounded-lg p-1">
          <input
            type="text"
            value={imageUrl}
            readOnly
            className="flex-grow p-2 bg-transparent text-slate-700 dark:text-slate-300 text-xs focus:outline-none"
            onClick={(e) => (e.target as HTMLInputElement).select()}
          />
          <button
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            onClick={handleCopyLink}
            className="px-3 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-md text-xs font-medium transition-colors"
          >
            {linkCopied ? "Copied!" : <FaLink className="inline mr-1" />} {linkCopied ? "" : "Copy Link"}
          </button>
        </div>
      </div>
    </div>
  );
};