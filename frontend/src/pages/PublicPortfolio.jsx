import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import portfolioService from '../services/portfolioService.js';

export default function PublicPortfolio() {
  const { slug } = useParams();
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        setLoading(true);
        const data = await portfolioService.getPortfolioBySlug(slug);
        
        if (!data) {
          setError('Portfolio not found');
          return;
        }

        // Record the view
        await portfolioService.recordPortfolioView(data.id, {
          ip_address: 'client-side',
          user_agent: navigator.userAgent
        });

        setPortfolio(data);
      } catch (error) {
        console.error('Error fetching portfolio:', error);
        setError('Portfolio not found');
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolio();
  }, [slug]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const shareOnLinkedIn = () => {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(`${portfolio?.name}'s Portfolio`);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}&title=${title}`, '_blank');
  };

  const shareOnTwitter = () => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(`Check out ${portfolio?.name}'s amazing portfolio!`);
    window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-200/20 rounded-full blur-3xl animate-float-delayed"></div>
          <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-purple-200/20 rounded-full blur-2xl animate-float-slow"></div>
        </div>

        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Loading Portfolio</h2>
            <p className="text-gray-600">Please wait while we fetch the portfolio...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center space-x-3 mb-6 hover:scale-105 transition-transform duration-300">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-2xl">D</span>
              </div>
              <span className="text-3xl font-bold text-gray-900">Devfolio</span>
            </Link>
          </div>

          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-gray-200/50">
            <div className="text-center">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-3">Portfolio Not Found</h2>
              <p className="text-gray-600 text-lg mb-6">The portfolio you're looking for doesn't exist or has been removed.</p>
              <div className="space-y-4">
                <Link
                  to="/"
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl"
                >
                  Go Home
                </Link>
                <Link
                  to="/create"
                  className="block w-full mt-3 text-blue-600 hover:text-blue-700 font-semibold transition-colors"
                >
                  Create Your Portfolio
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-200/20 rounded-full blur-3xl animate-float-delayed"></div>
          <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-purple-200/20 rounded-full blur-2xl animate-float-slow"></div>
        </div>

      {/* Header */}
      <header className="relative z-10 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 sticky top-0">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-3 hover:scale-105 transition-transform duration-300">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">D</span>
              </div>
              <span className="text-2xl font-bold text-gray-900">Devfolio</span>
            </Link>
            
            {/* Share Button */}
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowShareModal(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                </svg>
                <span>Share</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 overflow-hidden animate-fade-in">
          
          {/* Profile Section */}
          <div className="text-center p-8 bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden shadow-2xl border-4 border-white">
              {portfolio.profile_picture_url ? (
                <img 
                  src={portfolio.profile_picture_url} 
                  alt={portfolio.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center">
                  <span className="text-white text-4xl font-bold">{portfolio.name.charAt(0).toUpperCase()}</span>
                </div>
              )}
            </div>
            
            <h1 className="text-4xl font-bold text-gray-900 mb-4 animate-fade-in stagger-1">
              {portfolio.name}
            </h1>
            
            <p className="text-xl text-gray-600 mb-4 animate-fade-in stagger-2">
              {portfolio.bio}
            </p>
            
            {portfolio.location && (
              <p className="text-gray-500 animate-fade-in stagger-3">
                📍 {portfolio.location}
              </p>
            )}
          </div>

          {/* Content Sections */}
          <div className="p-8 space-y-8">
            
                         {/* Education */}
             {portfolio.education && portfolio.education.length > 0 && (
               <Section title="Education" icon="🎓">
                 {portfolio.education.map((edu) => (
                   <div key={edu.id} className="bg-white/50 rounded-2xl p-6 mb-4 border border-gray-100 hover:shadow-lg transition-all duration-300">
                     <h3 className="text-xl font-bold text-gray-900 mb-2">{edu.institution}</h3>
                     <p className="text-lg text-gray-700 mb-1">{edu.degree}</p>
                     <p className="text-gray-500">{edu.year}</p>
                     {edu.description && (
                       <div className="text-gray-600 mt-2 leading-relaxed whitespace-pre-line text-left">
                         {edu.description.split('\n').map((line, index) => (
                           <div key={index} className="mb-2 text-left">
                             {line.trim()}
                           </div>
                         ))}
                       </div>
                     )}
                   </div>
                 ))}
               </Section>
             )}

             {/* Experience */}
             {portfolio.experience && portfolio.experience.length > 0 && (
               <Section title="Experience" icon="💼">
                 {portfolio.experience.map((exp) => (
                   <div key={exp.id} className="bg-white/50 rounded-2xl p-6 mb-4 border border-gray-100 hover:shadow-lg transition-all duration-300">
                     <h3 className="text-xl font-bold text-gray-900 mb-2">{exp.position}</h3>
                     <p className="text-lg text-gray-700 mb-1">{exp.company}</p>
                     <p className="text-gray-500 mb-2">{exp.duration}</p>
                     {exp.description && (
                       <div className="text-gray-600 leading-relaxed text-left">
                         {exp.description.split('.').filter(sentence => sentence.trim()).map((sentence, index) => (
                           <div key={index} className="mb-3 text-left flex items-start">
                             <span className="inline-block w-2 h-2 bg-gray-500 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                             <span className="flex-1">
                               {sentence.trim()}{index < exp.description.split('.').filter(s => s.trim()).length - 1 ? '.' : ''}
                             </span>
                           </div>
                         ))}
                       </div>
                     )}
                   </div>
                 ))}
               </Section>
             )}

             {/* Skills */}
             {portfolio.skills && portfolio.skills.length > 0 && (
               <Section title="Skills" icon="⚡">
                 <div className="flex flex-wrap gap-3">
                   {portfolio.skills.map((skill) => (
                     <span 
                       key={skill.id}
                       className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full text-sm font-semibold hover:scale-105 transition-transform duration-300"
                     >
                       {skill.name}
                     </span>
                   ))}
                 </div>
               </Section>
             )}

             {/* Projects */}
             {portfolio.projects && portfolio.projects.length > 0 && (
               <Section title="Projects" icon="🚀">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   {portfolio.projects.map((project) => (
                     <div key={project.id} className="bg-white/50 rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-all duration-300">
                       <h3 className="text-xl font-bold text-gray-900 mb-2">{project.title}</h3>
                       {project.description && (
                         <div className="text-gray-600 mb-4 leading-relaxed text-left">
                           {project.description.split('.').filter(sentence => sentence.trim()).map((sentence, index) => (
                             <div key={index} className="mb-3 text-left flex items-start">
                               <span className="inline-block w-2 h-2 bg-gray-500 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                               <span className="flex-1">
                                 {sentence.trim()}{index < project.description.split('.').filter(s => s.trim()).length - 1 ? '.' : ''}
                               </span>
                             </div>
                           ))}
                         </div>
                       )}
                       
                       {project.technologies && project.technologies.length > 0 && (
                         <div className="flex flex-wrap gap-2 mb-4">
                           {project.technologies.map((tech, techIndex) => (
                             <span key={techIndex} className="px-2 py-1 bg-gray-200 text-gray-700 rounded-full text-xs">
                               {tech}
                             </span>
                           ))}
                         </div>
                       )}
                       
                       <div className="flex space-x-3">
                         {project.github_link && (
                           <a 
                             href={project.github_link}
                             target="_blank"
                             rel="noopener noreferrer"
                             className="flex items-center space-x-2 px-4 py-2 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all duration-300"
                           >
                             <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                               <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                             </svg>
                             <span>GitHub</span>
                           </a>
                         )}
                         {project.live_link && (
                           <a 
                             href={project.live_link}
                             target="_blank"
                             rel="noopener noreferrer"
                             className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300"
                           >
                             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                             </svg>
                             <span>Live Demo</span>
                           </a>
                         )}
                       </div>
                     </div>
                   ))}
                 </div>
               </Section>
             )}

             {/* Social Links */}
             {portfolio.social_links && portfolio.social_links.length > 0 && (
               <Section title="Connect" icon="🔗">
                 <div className="flex flex-wrap gap-4">
                   {portfolio.social_links.map((link) => (
                     <a 
                       key={link.id}
                       href={link.url}
                       target="_blank"
                       rel="noopener noreferrer"
                       className="flex items-center space-x-3 px-6 py-3 bg-white/50 rounded-xl border border-gray-100 hover:shadow-lg transition-all duration-300 hover:scale-105"
                     >
                       <span className="text-2xl">{getSocialIcon(link.platform)}</span>
                       <span className="font-semibold text-gray-900 capitalize">{link.platform}</span>
                     </a>
                   ))}
                 </div>
               </Section>
             )}
           </div>
         </div>
       </div>

       {/* Share Modal */}
       {showShareModal && (
         <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
           <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 max-w-md w-full p-8 animate-fade-in">
             <div className="text-center mb-6">
               <h3 className="text-2xl font-bold text-gray-900 mb-2">Share Portfolio</h3>
               <p className="text-gray-600">Share {portfolio?.name}'s portfolio with others</p>
             </div>
             
             <div className="space-y-4">
               <button
                 onClick={copyToClipboard}
                 className="w-full flex items-center justify-center space-x-3 px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl"
               >
                 {copied ? (
                   <>
                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                     </svg>
                     <span>Copied!</span>
                   </>
                 ) : (
                   <>
                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                     </svg>
                     <span>Copy Link</span>
                   </>
                 )}
               </button>
               
               <button
                 onClick={shareOnLinkedIn}
                 className="w-full flex items-center justify-center space-x-3 px-6 py-4 bg-blue-700 text-white rounded-xl hover:bg-blue-800 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl"
               >
                 <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                   <path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-9h3v9zm-1.5-10.28c-.966 0-1.75-.79-1.75-1.76s.784-1.76 1.75-1.76 1.75.79 1.75 1.76-.784 1.76-1.75 1.76zm15.5 10.28h-3v-4.5c0-1.08-.02-2.47-1.5-2.47-1.5 0-1.73 1.17-1.73 2.38v4.59h-3v-9h2.89v1.23h.04c.4-.75 1.38-1.54 2.84-1.54 3.04 0 3.6 2 3.6 4.59v4.72z" />
                 </svg>
                 <span>Share on LinkedIn</span>
               </button>
               
               <button
                 onClick={shareOnTwitter}
                 className="w-full flex items-center justify-center space-x-3 px-6 py-4 bg-sky-500 text-white rounded-xl hover:bg-sky-600 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl"
               >
                 <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                   <path d="M22.46 5.924c-.793.352-1.645.59-2.54.698a4.48 4.48 0 0 0 1.963-2.475 8.94 8.94 0 0 1-2.828 1.082 4.48 4.48 0 0 0-7.64 4.086A12.72 12.72 0 0 1 3.112 4.89a4.48 4.48 0 0 0 1.388 5.976 4.47 4.47 0 0 1-2.03-.561v.057a4.48 4.48 0 0 0 3.594 4.393 4.5 4.5 0 0 1-2.025.077 4.48 4.48 0 0 0 4.184 3.114A8.98 8.98 0 0 1 2 19.54a12.67 12.67 0 0 0 6.88 2.017c8.26 0 12.785-6.84 12.785-12.785 0-.195-.004-.39-.013-.583A9.22 9.22 0 0 0 24 4.59a8.98 8.98 0 0 1-2.54.697z" />
                 </svg>
                 <span>Share on Twitter</span>
               </button>
             </div>
             
             <button
               onClick={() => setShowShareModal(false)}
               className="w-full mt-6 px-6 py-3 text-gray-600 hover:text-gray-800 font-semibold transition-colors"
             >
               Close
             </button>
           </div>
         </div>
       )}
     </div>
   );
 }

// Helper Components
function Section({ title, icon, children }) {
  return (
    <div className="animate-fade-in">
      <div className="flex items-center space-x-3 mb-6">
        <span className="text-3xl">{icon}</span>
        <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
      </div>
      {children}
    </div>
  );
}

function getSocialIcon(platform) {
  const icons = {
    github: '🐙',
    linkedin: '💼',
    twitter: '🐦',
    website: '🌐'
  };
  return icons[platform] || '🔗';
} 