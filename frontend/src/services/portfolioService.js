import { supabase } from '../supabase';

class PortfolioService {
  // ==================== PORTFOLIO OPERATIONS ====================
  
  /**
   * Create a new portfolio
   */
  async createPortfolio(portfolioData) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('portfolios')
        .insert({
          user_id: user.id,
          name: portfolioData.name,
          bio: portfolioData.bio,
          profile_picture_url: portfolioData.profilePicture,
          location: portfolioData.location,
          is_public: true
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating portfolio:', error);
      throw error;
    }
  }

  /**
   * Get all portfolios for the current user
   */
  async getUserPortfolios() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('portfolios')
        .select(`
          *,
          education (*),
          experience (*),
          skills (*),
          projects (*),
          social_links (*),
          contact_info (*)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching user portfolios:', error);
      throw error;
    }
  }

  /**
   * Get a specific portfolio by ID
   */
  async getPortfolioById(portfolioId) {
    try {
      const { data, error } = await supabase
        .from('portfolios')
        .select(`
          *,
          education (*),
          experience (*),
          skills (*),
          projects (*),
          social_links (*),
          contact_info (*)
        `)
        .eq('id', portfolioId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching portfolio:', error);
      throw error;
    }
  }

  /**
   * Get a portfolio by slug (for public viewing)
   */
  async getPortfolioBySlug(slug) {
    try {
      const { data, error } = await supabase
        .from('portfolios')
        .select(`
          *,
          education (*),
          experience (*),
          skills (*),
          projects (*),
          social_links (*),
          contact_info (*)
        `)
        .eq('slug', slug)
        .eq('is_public', true)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching portfolio by slug:', error);
      throw error;
    }
  }

  /**
   * Update a portfolio
   */
  async updatePortfolio(portfolioId, updates) {
    try {
      const { data, error } = await supabase
        .from('portfolios')
        .update(updates)
        .eq('id', portfolioId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating portfolio:', error);
      throw error;
    }
  }

  /**
   * Delete a portfolio
   */
  async deletePortfolio(portfolioId) {
    try {
      const { error } = await supabase
        .from('portfolios')
        .delete()
        .eq('id', portfolioId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting portfolio:', error);
      throw error;
    }
  }

  // ==================== EDUCATION OPERATIONS ====================
  
  /**
   * Add education entry
   */
  async addEducation(portfolioId, educationData) {
    try {
      const { data, error } = await supabase
        .from('education')
        .insert({
          portfolio_id: portfolioId,
          institution: educationData.institution,
          degree: educationData.degree,
          year: educationData.year,
          description: educationData.description,
          start_date: educationData.startDate,
          end_date: educationData.endDate,
          gpa: educationData.gpa
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error adding education:', error);
      throw error;
    }
  }

  /**
   * Update education entry
   */
  async updateEducation(educationId, updates) {
    try {
      const { data, error } = await supabase
        .from('education')
        .update(updates)
        .eq('id', educationId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating education:', error);
      throw error;
    }
  }

  /**
   * Delete education entry
   */
  async deleteEducation(educationId) {
    try {
      const { error } = await supabase
        .from('education')
        .delete()
        .eq('id', educationId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting education:', error);
      throw error;
    }
  }

  // ==================== EXPERIENCE OPERATIONS ====================
  
  /**
   * Add experience entry
   */
  async addExperience(portfolioId, experienceData) {
    try {
      const { data, error } = await supabase
        .from('experience')
        .insert({
          portfolio_id: portfolioId,
          company: experienceData.company,
          position: experienceData.position,
          duration: experienceData.duration,
          description: experienceData.description,
          start_date: experienceData.startDate,
          end_date: experienceData.endDate,
          is_current: experienceData.isCurrent,
          company_logo_url: experienceData.companyLogoUrl
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error adding experience:', error);
      throw error;
    }
  }

  /**
   * Update experience entry
   */
  async updateExperience(experienceId, updates) {
    try {
      const { data, error } = await supabase
        .from('experience')
        .update(updates)
        .eq('id', experienceId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating experience:', error);
      throw error;
    }
  }

  /**
   * Delete experience entry
   */
  async deleteExperience(experienceId) {
    try {
      const { error } = await supabase
        .from('experience')
        .delete()
        .eq('id', experienceId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting experience:', error);
      throw error;
    }
  }

  // ==================== SKILLS OPERATIONS ====================
  
  /**
   * Add skill
   */
  async addSkill(portfolioId, skillData) {
    try {
      const { data, error } = await supabase
        .from('skills')
        .insert({
          portfolio_id: portfolioId,
          name: skillData.name,
          category: skillData.category || 'general',
          proficiency_level: skillData.proficiencyLevel
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error adding skill:', error);
      throw error;
    }
  }

  /**
   * Update skill
   */
  async updateSkill(skillId, updates) {
    try {
      const { data, error } = await supabase
        .from('skills')
        .update(updates)
        .eq('id', skillId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating skill:', error);
      throw error;
    }
  }

  /**
   * Delete skill
   */
  async deleteSkill(skillId) {
    try {
      const { error } = await supabase
        .from('skills')
        .delete()
        .eq('id', skillId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting skill:', error);
      throw error;
    }
  }

  /**
   * Add multiple skills at once
   */
  async addSkills(portfolioId, skillsArray) {
    try {
      const skillsData = skillsArray.map(skill => ({
        portfolio_id: portfolioId,
        name: skill,
        category: 'general'
      }));

      const { data, error } = await supabase
        .from('skills')
        .insert(skillsData)
        .select();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error adding skills:', error);
      throw error;
    }
  }

  // ==================== PROJECTS OPERATIONS ====================
  
  /**
   * Add project
   */
  async addProject(portfolioId, projectData) {
    try {
      const { data, error } = await supabase
        .from('projects')
        .insert({
          portfolio_id: portfolioId,
          title: projectData.title,
          description: projectData.description,
          github_link: projectData.githubLink,
          live_link: projectData.liveLink,
          image_url: projectData.imageUrl,
          technologies: projectData.technologies,
          featured: projectData.featured || false
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error adding project:', error);
      throw error;
    }
  }

  /**
   * Update project
   */
  async updateProject(projectId, updates) {
    try {
      const { data, error } = await supabase
        .from('projects')
        .update(updates)
        .eq('id', projectId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating project:', error);
      throw error;
    }
  }

  /**
   * Delete project
   */
  async deleteProject(projectId) {
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting project:', error);
      throw error;
    }
  }

  // ==================== SOCIAL LINKS OPERATIONS ====================
  
  /**
   * Add social link
   */
  async addSocialLink(portfolioId, socialData) {
    try {
      const { data, error } = await supabase
        .from('social_links')
        .insert({
          portfolio_id: portfolioId,
          platform: socialData.platform,
          url: socialData.url,
          display_name: socialData.displayName
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error adding social link:', error);
      throw error;
    }
  }

  /**
   * Update social link
   */
  async updateSocialLink(socialLinkId, updates) {
    try {
      const { data, error } = await supabase
        .from('social_links')
        .update(updates)
        .eq('id', socialLinkId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating social link:', error);
      throw error;
    }
  }

  /**
   * Delete social link
   */
  async deleteSocialLink(socialLinkId) {
    try {
      const { error } = await supabase
        .from('social_links')
        .delete()
        .eq('id', socialLinkId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting social link:', error);
      throw error;
    }
  }

  /**
   * Add multiple social links at once
   */
  async addSocialLinks(portfolioId, socialLinks) {
    try {
      const socialData = Object.entries(socialLinks)
        .filter(([_, url]) => url && url.trim() !== '')
        .map(([platform, url]) => ({
          portfolio_id: portfolioId,
          platform,
          url
        }));

      if (socialData.length === 0) return [];

      const { data, error } = await supabase
        .from('social_links')
        .insert(socialData)
        .select();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error adding social links:', error);
      throw error;
    }
  }

  // ==================== CONTACT INFO OPERATIONS ====================
  
  /**
   * Add or update contact info
   */
  async upsertContactInfo(portfolioId, contactData) {
    try {
      const { data, error } = await supabase
        .from('contact_info')
        .upsert({
          portfolio_id: portfolioId,
          email: contactData.email,
          phone: contactData.phone,
          website: contactData.website,
          address: contactData.address
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error upserting contact info:', error);
      throw error;
    }
  }

  // ==================== PORTFOLIO VIEWS ====================
  
  /**
   * Record a portfolio view
   */
  async recordPortfolioView(portfolioId, viewData = {}) {
    try {
      const { error } = await supabase
        .from('portfolio_views')
        .insert({
          portfolio_id: portfolioId,
          viewer_ip: viewData.viewerIp,
          user_agent: viewData.userAgent,
          referrer: viewData.referrer
        });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error recording portfolio view:', error);
      // Don't throw error for view tracking as it's not critical
      return false;
    }
  }

  // ==================== BULK OPERATIONS ====================
  
  /**
   * Create complete portfolio with all related data
   */
  async createCompletePortfolio(portfolioData) {
    try {
      // Create portfolio first
      const portfolio = await this.createPortfolio(portfolioData);

      // Add education entries
      if (portfolioData.education && portfolioData.education.length > 0) {
        for (const edu of portfolioData.education) {
          await this.addEducation(portfolio.id, edu);
        }
      }

      // Add experience entries
      if (portfolioData.experience && portfolioData.experience.length > 0) {
        for (const exp of portfolioData.experience) {
          await this.addExperience(portfolio.id, exp);
        }
      }

      // Add skills
      if (portfolioData.skills && portfolioData.skills.length > 0) {
        await this.addSkills(portfolio.id, portfolioData.skills);
      }

      // Add projects
      if (portfolioData.projects && portfolioData.projects.length > 0) {
        for (const project of portfolioData.projects) {
          await this.addProject(portfolio.id, project);
        }
      }

      // Add social links
      if (portfolioData.socialLinks) {
        await this.addSocialLinks(portfolio.id, portfolioData.socialLinks);
      }

      // Add contact info
      if (portfolioData.email) {
        await this.upsertContactInfo(portfolio.id, { email: portfolioData.email });
      }

      return portfolio;
    } catch (error) {
      console.error('Error creating complete portfolio:', error);
      throw error;
    }
  }

  /**
   * Transform form data to database format
   */
  transformFormDataToDatabase(formData) {
    return {
      name: formData.name,
      bio: formData.bio,
      profilePicture: formData.profilePicture,
      location: formData.location,
      education: formData.education.map(edu => ({
        institution: edu.institution,
        degree: edu.degree,
        year: edu.year,
        description: edu.description
      })),
      experience: formData.experience.map(exp => ({
        company: exp.company,
        position: exp.position,
        duration: exp.duration,
        description: exp.description
      })),
      skills: formData.skills,
      projects: formData.projects.map(proj => ({
        title: proj.title,
        description: proj.description,
        githubLink: proj.githubLink,
        liveLink: proj.liveLink
      })),
      socialLinks: formData.socialLinks,
      email: formData.email
    };
  }
}

export default new PortfolioService(); 