import React, { useState } from 'react';
import PortfolioViewer from './PortfolioViewer';
import portfolioService from './services/portfolioService';

const CreatePortfolio = () => {
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    email: '',
    profilePicture: '',
    education: [{ institution: '', degree: '', year: '', description: '' }],
    experience: [{ company: '', position: '', duration: '', description: '' }],
    skills: [],
    projects: [{ title: '', description: '', githubLink: '', liveLink: '' }],
    socialLinks: {
      github: '',
      linkedin: '',
      twitter: ''
    }
  });

  const [newSkill, setNewSkill] = useState('');

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayChange = (field, index, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => 
        i === index ? { ...item, ...value } : item
      )
    }));
  };

  const addArrayItem = (field) => {
    const templates = {
      education: { institution: '', degree: '', year: '', description: '' },
      experience: { company: '', position: '', duration: '', description: '' },
      projects: { title: '', description: '', githubLink: '', liveLink: '' }
    };
    
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], templates[field]]
    }));
  };

  const removeArrayItem = (field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const addSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const handleSocialLinkChange = (platform, value) => {
    setFormData(prev => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [platform]: value
      }
    }));
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      // Transform form data to database format
      const portfolioData = portfolioService.transformFormDataToDatabase(formData);
      console.log('Submitting portfolio data:', portfolioData);
      console.log('Experience descriptions:', portfolioData.experience.map(exp => exp.description));
      console.log('Project descriptions:', portfolioData.projects.map(proj => proj.description));
      
      // Create the complete portfolio in Supabase
      const portfolio = await portfolioService.createCompletePortfolio(portfolioData);
      
      const portfolioUrl = `${window.location.origin}/p/${portfolio.slug}`;
      setSubmitMessage(`Portfolio created successfully! Your portfolio is available at: ${portfolioUrl}`);
      
      // Auto-copy to clipboard
      try {
        await navigator.clipboard.writeText(portfolioUrl);
        setTimeout(() => {
          setSubmitMessage(`Portfolio created successfully! Link copied to clipboard: ${portfolioUrl}`);
        }, 1000);
      } catch (error) {
        console.error('Failed to copy to clipboard:', error);
      }
      
      // Reset form after successful submission
      setFormData({
        name: '',
        bio: '',
        email: '',
        profilePicture: '',
        education: [{ institution: '', degree: '', year: '', description: '' }],
        experience: [{ company: '', position: '', duration: '', description: '' }],
        skills: [],
        projects: [{ title: '', description: '', githubLink: '', liveLink: '' }],
        socialLinks: {
          github: '',
          linkedin: '',
          twitter: ''
        }
      });
    } catch (error) {
      console.error('Error creating portfolio:', error);
      
      // Handle different types of error objects
      let errorMessage = 'Unknown error occurred';
      
      if (typeof error === 'string') {
        errorMessage = error;
      } else if (error && typeof error === 'object') {
        if (error.message) {
          errorMessage = error.message;
        } else if (error.error) {
          errorMessage = error.error;
        } else if (error.details) {
          errorMessage = error.details;
        } else {
          errorMessage = JSON.stringify(error);
        }
      }
      
      setSubmitMessage(`Error creating portfolio: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // NEW FUNCTION - transforms form data to PortfolioViewer format
  const transformFormDataToPortfolio = (data) => {
    return {
      profile: {
        name: data.name || 'Your Name',
        avatar: data.profilePicture || 'https://randomuser.me/api/portraits/men/1.jpg',
        bio: data.bio || 'Tell us about yourself...',
        location: 'Your Location'
      },
      education: data.education.map(edu => ({
        school: edu.institution || 'Institution Name',
        degree: edu.degree || 'Degree',
        year: edu.year || 'Year'
      })),
      experience: data.experience.map(exp => ({
        company: exp.company || 'Company Name',
        role: exp.position || 'Position',
        period: exp.duration || 'Duration',
        description: exp.description || 'Description'
      })),
      projects: data.projects.map(proj => ({
        name: proj.title || 'Project Title',
        description: proj.description || 'Project Description',
        link: proj.githubLink || proj.liveLink || '#'
      })),
      skills: data.skills,
      social: {
        github: data.socialLinks.github || '',
        linkedin: data.socialLinks.linkedin || '',
        twitter: data.socialLinks.twitter || ''
      }
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-indigo-400/20 to-pink-600/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-cyan-400/10 to-blue-600/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '4s'}}></div>
      </div>

      {/* Modern Header with Enhanced Animations */}
      <header className="bg-white/90 backdrop-blur-xl border-b border-gray-200/50 sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 group">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 hover:shadow-2xl">
                <span className="text-white font-bold text-2xl">D</span>
              </div>
              <span className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent animate-pulse">Devfolio</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600 font-medium">Portfolio Builder</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section - Left Side */}
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 p-8 transform hover:scale-[1.02] transition-all duration-500 hover:shadow-3xl">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-6 shadow-lg transform hover:scale-110 transition-all duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent mb-4 animate-fade-in">
                Create Your Portfolio
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Build a stunning portfolio that showcases your skills and experience
              </p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Basic Information */}
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-6 border border-blue-200/50 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center group">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-xl flex items-center justify-center mr-4 shadow-lg transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <span className="bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent">Basic Information</span>
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-800 mb-3">
                        Full Name *
                      </label>
                      <div className="relative group">
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 text-lg bg-white/80 backdrop-blur-sm group-hover:bg-white group-hover:shadow-lg"
                          placeholder="Enter your full name"
                          required
                        />
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-800 mb-3">
                        Contact Email
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-lg"
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-3">
                    Bio *
                  </label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-lg resize-none"
                    placeholder="Tell us about yourself, your passion for coding, and what drives you..."
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-3">
                    Profile Picture URL
                  </label>
                  <input
                    type="url"
                    value={formData.profilePicture}
                    onChange={(e) => handleInputChange('profilePicture', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-lg"
                    placeholder="https://example.com/profile.jpg"
                  />
                  <p className="text-sm text-gray-500 mt-2 flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Upload functionality coming soon. For now, please provide a direct image URL.
                  </p>
                </div>
              </div>
            </div>

              {/* Skills */}
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-green-50 via-emerald-50 to-teal-50 rounded-2xl p-6 border border-green-200/50 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center group">
                    <div className="w-10 h-10 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 rounded-xl flex items-center justify-center mr-4 shadow-lg transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                    <span className="bg-gradient-to-r from-gray-900 via-green-900 to-emerald-900 bg-clip-text text-transparent">Skills & Expertise</span>
                  </h2>
                
                <div className="flex gap-3">
                  <div className="relative flex-1 group">
                    <input
                      type="text"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all duration-300 text-lg bg-white/80 backdrop-blur-sm group-hover:bg-white group-hover:shadow-lg"
                      placeholder="Add a skill..."
                    />
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-green-500/20 to-emerald-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                  </div>
                  <button
                    type="button"
                    onClick={addSkill}
                    className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-4 focus:ring-green-500/30 focus:ring-offset-2 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                  >
                    <div className="flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Add
                    </div>
                  </button>
                </div>
                
                <div className="flex flex-wrap gap-3">
                  {formData.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-4 py-2 rounded-full text-sm bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200 shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 animate-fade-in"
                      style={{animationDelay: `${index * 0.1}s`}}
                    >
                      <span className="mr-2">✨</span>
                      {skill}
                      <button
                        type="button"
                        onClick={() => removeSkill(skill)}
                        className="ml-3 text-green-600 hover:text-green-800 hover:scale-110 transition-transform duration-200 font-bold"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

              {/* Education */}
              <div className="space-y-6">
                <div className="flex justify-between items-center border-b pb-2">
                  <h2 className="text-xl font-semibold text-gray-800">
                    Education
                  </h2>
                  <button
                    type="button"
                    onClick={() => addArrayItem('education')}
                    className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    Add Education
                  </button>
                </div>
                
                {formData.education.map((edu, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium text-gray-800">Education #{index + 1}</h3>
                      {formData.education.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeArrayItem('education', index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Institution
                        </label>
                        <input
                          type="text"
                          value={edu.institution}
                          onChange={(e) => handleArrayChange('education', index, { institution: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Degree
                        </label>
                        <input
                          type="text"
                          value={edu.degree}
                          onChange={(e) => handleArrayChange('education', index, { degree: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Year
                        </label>
                        <input
                          type="text"
                          value={edu.year}
                          onChange={(e) => handleArrayChange('education', index, { year: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Description
                        </label>
                        <textarea
                          value={edu.description}
                          onChange={(e) => handleArrayChange('education', index, { description: e.target.value })}
                          rows={2}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Experience */}
              <div className="space-y-6">
                <div className="flex justify-between items-center border-b pb-2">
                  <h2 className="text-xl font-semibold text-gray-800">
                    Professional Experience
                  </h2>
                  <button
                    type="button"
                    onClick={() => addArrayItem('experience')}
                    className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    Add Experience
                  </button>
                </div>
                
                {formData.experience.map((exp, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium text-gray-800">Experience #{index + 1}</h3>
                      {formData.experience.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeArrayItem('experience', index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Company
                        </label>
                        <input
                          type="text"
                          value={exp.company}
                          onChange={(e) => handleArrayChange('experience', index, { company: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Position
                        </label>
                        <input
                          type="text"
                          value={exp.position}
                          onChange={(e) => handleArrayChange('experience', index, { position: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Duration
                        </label>
                        <input
                          type="text"
                          value={exp.duration}
                          onChange={(e) => handleArrayChange('experience', index, { duration: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="e.g., 2020-2023"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Description
                        </label>
                        <textarea
                          value={exp.description}
                          onChange={(e) => handleArrayChange('experience', index, { description: e.target.value })}
                          rows={2}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Projects */}
              <div className="space-y-6">
                <div className="flex justify-between items-center border-b pb-2">
                  <h2 className="text-xl font-semibold text-gray-800">
                    Projects
                  </h2>
                  <button
                    type="button"
                    onClick={() => addArrayItem('projects')}
                    className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    Add Project
                  </button>
                </div>
                
                {formData.projects.map((project, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium text-gray-800">Project #{index + 1}</h3>
                      {formData.projects.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeArrayItem('projects', index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Project Title
                        </label>
                        <input
                          type="text"
                          value={project.title}
                          onChange={(e) => handleArrayChange('projects', index, { title: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Description
                        </label>
                        <textarea
                          value={project.description}
                          onChange={(e) => handleArrayChange('projects', index, { description: e.target.value })}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            GitHub Link
                          </label>
                          <input
                            type="url"
                            value={project.githubLink}
                            onChange={(e) => handleArrayChange('projects', index, { githubLink: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="https://github.com/username/repo"
                          />
                        </div>
                        <div>
                          <label className="label text-sm font-medium text-gray-700 mb-1">
                            Live Link
                          </label>
                          <input
                            type="url"
                            value={project.liveLink}
                            onChange={(e) => handleArrayChange('projects', index, { liveLink: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="https://project-demo.com"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Social Links */}
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">
                  Social Links
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      GitHub
                    </label>
                    <input
                      type="url"
                      value={formData.socialLinks.github}
                      onChange={(e) => handleSocialLinkChange('github', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="https://github.com/username"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      LinkedIn
                    </label>
                    <input
                      type="url"
                      value={formData.socialLinks.linkedin}
                      onChange={(e) => handleSocialLinkChange('linkedin', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="https://linkedin.com/in/username"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Twitter
                    </label>
                    <input
                      type="url"
                      value={formData.socialLinks.twitter}
                      onChange={(e) => handleSocialLinkChange('twitter', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="https://twitter.com/username"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Message with Enhanced Animations */}
              {submitMessage && (
                <div className={`mt-8 p-6 rounded-2xl text-center transform transition-all duration-500 ${
                  submitMessage.includes('Error') 
                    ? 'bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 text-red-700 shadow-lg' 
                    : 'bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 text-green-700 shadow-lg'
                } animate-fade-in`}>
                  <div className="flex items-center justify-center mb-3">
                    {submitMessage.includes('Error') ? (
                      <svg className="w-8 h-8 text-red-500 mr-3 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    ) : (
                      <svg className="w-8 h-8 text-green-500 mr-3 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                    <span className="text-lg font-semibold">{submitMessage}</span>
                  </div>
                </div>
              )}

              {/* Enhanced Submit Button */}
              <div className="flex justify-center pt-8">
                <div className="relative group">
                  {/* Glow effect */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
                  
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`relative px-16 py-6 rounded-2xl text-white font-bold text-xl shadow-2xl transition-all duration-500 ${
                      isSubmitting
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-blue-500/30 focus:ring-offset-4 hover:shadow-3xl transform hover:scale-105 hover:-translate-y-1'
                    }`}
                  >
                    <div className="flex items-center">
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-4 h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span className="text-lg">Creating Portfolio...</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-8 h-8 mr-4 transform group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                          <span className="text-lg">Create Portfolio</span>
                        </>
                      )}
                    </div>
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Enhanced Preview Section - Right Side */}
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 p-8 transform hover:scale-[1.02] transition-all duration-500 hover:shadow-3xl">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full mb-6 shadow-lg transform hover:scale-110 transition-all duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-purple-900 to-pink-900 bg-clip-text text-transparent mb-4">
                Live Preview
              </h2>
              <p className="text-lg text-gray-600 mb-4">See your portfolio come to life</p>
            </div>
            
            <div className="relative">
              {/* Preview glow effect */}
              <div className="absolute -inset-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-3xl blur-xl opacity-0 hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden transform hover:scale-105 transition-all duration-300">
                <PortfolioViewer data={transformFormDataToPortfolio(formData)} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePortfolio;