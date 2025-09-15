import React, { useState, useEffect } from 'react';
import { Linkedin, Twitter, Globe, MessageCircle, Newspaper, MessageSquare, Mail, Zap, Lightbulb } from 'lucide-react';
import './MediaTimingDocumentation.css';

const MediaTimingDocumentation = () => {
  const [selectedPersona, setSelectedPersona] = useState('all');
  const [selectedTimezone, setSelectedTimezone] = useState('all');
  const [selectedDay, setSelectedDay] = useState('all');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showActionsModal, setShowActionsModal] = useState(false);

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Get time for different timezones
  const getTimezoneTime = (timezone) => {
    const options = {
      timeZone: timezone,
      hour12: false,
      hour: '2-digit',
      minute: '2-digit'
    };
    return currentTime.toLocaleTimeString('en-US', options);
  };

  // Get lead generation potential by media/persona/timezone
  const getLeadPotential = (media, persona, timezone) => {
    const leadData = {
      // LinkedIn Business (High-value, lower volume)
      'LinkedIn': {
        'Solo Developers': { EST: { reach: 8500, leads: 85, conversion: 12 }, CST: { reach: 4200, leads: 42, conversion: 10 }, PST: { reach: 12000, leads: 120, conversion: 15 } },
        'Startup Teams': { EST: { reach: 15000, leads: 225, conversion: 18 }, CST: { reach: 8500, leads: 127, conversion: 15 }, PST: { reach: 22000, leads: 330, conversion: 22 } },
        'CTOs/Founders': { EST: { reach: 25000, leads: 500, conversion: 25 }, CST: { reach: 12000, leads: 240, conversion: 20 }, PST: { reach: 35000, leads: 700, conversion: 30 } }
      },
      // Twitter/X (Medium volume, medium conversion)
      'Twitter/X': {
        'Solo Developers': { EST: { reach: 18000, leads: 180, conversion: 8 }, CST: { reach: 12000, leads: 120, conversion: 6 }, PST: { reach: 25000, leads: 250, conversion: 10 } },
        'Startup Teams': { EST: { reach: 22000, leads: 220, conversion: 12 }, CST: { reach: 15000, leads: 150, conversion: 10 }, PST: { reach: 30000, leads: 300, conversion: 15 } },
        'CTOs/Founders': { EST: { reach: 12000, leads: 120, conversion: 15 }, CST: { reach: 8000, leads: 80, conversion: 12 }, PST: { reach: 18000, leads: 180, conversion: 18 } }
      },
      // Reddit (High volume, lower conversion)
      'Reddit': {
        'Solo Developers': { EST: { reach: 45000, leads: 315, conversion: 4 }, CST: { reach: 28000, leads: 196, conversion: 3 }, PST: { reach: 55000, leads: 385, conversion: 5 } },
        'Startup Teams': { EST: { reach: 35000, leads: 280, conversion: 6 }, CST: { reach: 22000, leads: 176, conversion: 5 }, PST: { reach: 40000, leads: 320, conversion: 7 } },
        'CTOs/Founders': { EST: { reach: 15000, leads: 150, conversion: 8 }, CST: { reach: 10000, leads: 100, conversion: 6 }, PST: { reach: 18000, leads: 180, conversion: 10 } }
      },
      // Discord (Medium volume, high engagement)
      'Discord': {
        'Solo Developers': { EST: { reach: 8500, leads: 127, conversion: 12 }, CST: { reach: 5500, leads: 82, conversion: 10 }, PST: { reach: 12000, leads: 180, conversion: 15 } },
        'Startup Teams': { EST: { reach: 4200, leads: 84, conversion: 18 }, CST: { reach: 2800, leads: 56, conversion: 15 }, PST: { reach: 6000, leads: 120, conversion: 20 } },
        'CTOs/Founders': { EST: { reach: 2500, leads: 75, conversion: 25 }, CST: { reach: 1500, leads: 45, conversion: 20 }, PST: { reach: 3500, leads: 105, conversion: 30 } }
      },
      // Dev.to (Developer-focused, medium volume)
      'Dev.to': {
        'Solo Developers': { EST: { reach: 12000, leads: 144, conversion: 8 }, CST: { reach: 7500, leads: 90, conversion: 6 }, PST: { reach: 18000, leads: 216, conversion: 10 } },
        'Startup Teams': { EST: { reach: 8000, leads: 120, conversion: 12 }, CST: { reach: 5000, leads: 75, conversion: 10 }, PST: { reach: 12000, leads: 180, conversion: 15 } },
        'CTOs/Founders': { EST: { reach: 5000, leads: 100, conversion: 18 }, CST: { reach: 3000, leads: 60, conversion: 15 }, PST: { reach: 7500, leads: 150, conversion: 22 } }
      },
      // Indie Hackers (Entrepreneur focus, high conversion)
      'Indie Hackers': {
        'Solo Developers': { EST: { reach: 6500, leads: 130, conversion: 15 }, CST: { reach: 4000, leads: 80, conversion: 12 }, PST: { reach: 9500, leads: 190, conversion: 18 } },
        'Startup Teams': { EST: { reach: 8500, leads: 212, conversion: 22 }, CST: { reach: 5500, leads: 137, conversion: 18 }, PST: { reach: 12000, leads: 300, conversion: 25 } },
        'CTOs/Founders': { EST: { reach: 4500, leads: 135, conversion: 28 }, CST: { reach: 2800, leads: 84, conversion: 25 }, PST: { reach: 6500, leads: 195, conversion: 32 } }
      },
      // Email Mautic (High conversion, targeted)
      'Email Mautic': {
        'Solo Developers': { EST: { reach: 2500, leads: 325, conversion: 35 }, CST: { reach: 1800, leads: 234, conversion: 30 }, PST: { reach: 3200, leads: 416, conversion: 40 } },
        'Startup Teams': { EST: { reach: 1200, leads: 204, conversion: 42 }, CST: { reach: 800, leads: 136, conversion: 38 }, PST: { reach: 1500, leads: 255, conversion: 45 } },
        'CTOs/Founders': { EST: { reach: 800, leads: 200, conversion: 50 }, CST: { reach: 500, leads: 125, conversion: 45 }, PST: { reach: 1000, leads: 250, conversion: 55 } }
      },
      // Hacker News (Tech elite, high conversion)
      'Hacker News': {
        'Solo Developers': { EST: { reach: 25000, leads: 375, conversion: 6 }, CST: { reach: 15000, leads: 225, conversion: 5 }, PST: { reach: 35000, leads: 525, conversion: 8 } },
        'Startup Teams': { EST: { reach: 20000, leads: 400, conversion: 12 }, CST: { reach: 12000, leads: 240, conversion: 10 }, PST: { reach: 28000, leads: 560, conversion: 15 } },
        'CTOs/Founders': { EST: { reach: 15000, leads: 450, conversion: 22 }, CST: { reach: 9000, leads: 270, conversion: 18 }, PST: { reach: 22000, leads: 660, conversion: 25 } }
      },
      // Product Hunt (Startup ecosystem, medium-high conversion)
      'Product Hunt': {
        'Solo Developers': { EST: { reach: 8500, leads: 127, conversion: 10 }, CST: { reach: 5000, leads: 75, conversion: 8 }, PST: { reach: 12000, leads: 180, conversion: 12 } },
        'Startup Teams': { EST: { reach: 15000, leads: 300, conversion: 18 }, CST: { reach: 9000, leads: 180, conversion: 15 }, PST: { reach: 22000, leads: 440, conversion: 22 } },
        'CTOs/Founders': { EST: { reach: 12000, leads: 360, conversion: 25 }, CST: { reach: 7000, leads: 210, conversion: 20 }, PST: { reach: 18000, leads: 540, conversion: 28 } }
      }
    };

    const defaultData = { reach: 1000, leads: 10, conversion: 1 };
    const data = leadData[media]?.[persona]?.[timezone] || defaultData;
    
    return {
      estimatedReach: data.reach,
      potentialLeads: data.leads,
      conversionRate: data.conversion,
      revenueEstimate: data.leads * (media === 'Email Mautic' ? 997 : media === 'LinkedIn' ? 297 : 97) // Average value per lead
    };
  };

  // Get all daily actions with priority and efficiency based on timing
  const getAllDailyActions = () => {
    const now = new Date();
    const parisHour = parseInt(getTimezoneTime('Europe/Paris').split(':')[0]);
    const parisMinute = parseInt(getTimezoneTime('Europe/Paris').split(':')[1]);
    const currentTime = parisHour * 60 + parisMinute; // Current time in minutes
    
    const actions = [];

    // Get current date and next day for proper scheduling
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const formatDate = (date) => {
      return date.toLocaleDateString('fr-FR', { 
        day: '2-digit', 
        month: '2-digit',
        year: '2-digit'
      });
    };

    // Define all 24/7 actions with their optimal times (Paris time)
    const dailySchedule = [
      // EARLY MORNING - Global coverage start
      { hour: 6, time: '06:00 Paris (00:00 EST)', action: 'Dev.to EST night', postTitle: 'Why API integration fails at 3AM (and how to prevent it)', media: 'Dev.to', personas: ['Solo Developers'], optimalWindow: 60 },
      { hour: 7, time: '07:00 Paris (00:00 CST)', action: 'Dev.to CST night', postTitle: 'Night owl developers: Best APIs for late-night coding', media: 'Dev.to', personas: ['Solo Developers'], optimalWindow: 60 },
      { hour: 8, time: '08:00 Paris (02:00 EST)', action: 'Hacker News EST', postTitle: 'Show HN: OnlyOneAPI - 401 endpoints for developers', media: 'Hacker News', personas: ['Solo Developers', 'CTOs/Founders'], optimalWindow: 30 },
      { hour: 9, time: '09:00 Paris (23:00 PST)', action: 'Dev.to PST night', postTitle: 'West Coast late-night coding with OnlyOneAPI', media: 'Dev.to', personas: ['Solo Developers'], optimalWindow: 60 },
      { hour: 10, time: '10:00 Paris (04:00 EST)', action: 'Product Hunt EST', postTitle: 'OnlyOneAPI Launch - The API marketplace developers deserve', media: 'Product Hunt', personas: ['Startup Teams', 'CTOs/Founders'], optimalWindow: 30 },

      // MORNING BUSINESS HOURS - Multi-timezone LinkedIn
      { hour: 14, time: '14:00 Paris (08:00 EST)', action: 'LinkedIn EST morning', postTitle: 'CTOs: Your API integration strategy is broken. Here\'s how to fix it.', media: 'LinkedIn', personas: ['CTOs/Founders'], optimalWindow: 90 },
      { hour: 15, time: '15:00 Paris (08:00 CST)', action: 'LinkedIn CST morning', postTitle: 'Midwest CTOs: API consolidation saves $10K/month', media: 'LinkedIn', personas: ['CTOs/Founders'], optimalWindow: 90 },
      { hour: 16, time: '16:00 Paris (07:00 PST)', action: 'LinkedIn PST morning', postTitle: 'Silicon Valley CTOs: The API integration tax is real', media: 'LinkedIn', personas: ['CTOs/Founders'], optimalWindow: 90 },

      // AFTERNOON DEV ENGAGEMENT - Multi-timezone Discord
      { hour: 17, time: '17:00 Paris (11:00 EST)', action: 'Discord EST dev', postTitle: 'Live coding session: Building with 10 APIs simultaneously', media: 'Discord', personas: ['Solo Developers'], optimalWindow: 120 },
      { hour: 18, time: '18:00 Paris (11:00 CST)', action: 'Discord CST dev', postTitle: 'Midwest devs: API debugging office hours', media: 'Discord', personas: ['Solo Developers'], optimalWindow: 120 },

      // LUNCH TIME TWITTER - Multi-timezone coverage
      { hour: 18, time: '18:00 Paris (12:00 EST)', action: 'Twitter EST lunch', postTitle: 'Thread: 15 APIs that saved my startup $50K this year', media: 'Twitter/X', personas: ['Solo Developers', 'Startup Teams'], optimalWindow: 90 },
      { hour: 19, time: '19:00 Paris (12:00 CST)', action: 'Twitter CST lunch', postTitle: 'Midwest developers: Your API stack is costing you sleep', media: 'Twitter/X', personas: ['Solo Developers'], optimalWindow: 90 },
      { hour: 19, time: '19:00 Paris (10:00 PST)', action: 'Discord PST dev', postTitle: 'West Coast devs: Morning API architecture discussion', media: 'Discord', personas: ['Solo Developers'], optimalWindow: 120 },

      // AFTERNOON REDDIT PEAK - Multi-timezone Reddit strategy
      { hour: 20, time: '20:00 Paris (14:00 EST)', action: 'Reddit EST post', postTitle: 'r/webdev: API management is eating my time - authentic story', media: 'Reddit', personas: ['Solo Developers'], optimalWindow: 180 },
      { hour: 21, time: '21:00 Paris (14:00 CST)', action: 'Reddit CST post', postTitle: 'r/startups: How we cut API costs by 47% - case study', media: 'Reddit', personas: ['Startup Teams'], optimalWindow: 180 },
      { hour: 21, time: '21:00 Paris (12:00 PST)', action: 'Twitter PST lunch', postTitle: 'West Coast devs: API integration reality check', media: 'Twitter/X', personas: ['Solo Developers'], optimalWindow: 90 },

      // EVENING ENGAGEMENT - Prime time coverage
      { hour: 22, time: '22:00 Paris (16:00 EST)', action: 'Indie Hackers EST', postTitle: 'From $0 to $10K MRR with API integrations - My journey', media: 'Indie Hackers', personas: ['Solo Developers'], optimalWindow: 120 },
      { hour: 23, time: '23:00 Paris (14:00 PST)', action: 'Reddit PST post', postTitle: 'r/SideProject: OnlyOneAPI showcase + feedback ask', media: 'Reddit', personas: ['Solo Developers'], optimalWindow: 180 },
      { hour: 23, time: '23:00 Paris (16:00 CST)', action: 'Indie Hackers CST', postTitle: 'Midwest makers: API costs killing your side project?', media: 'Indie Hackers', personas: ['Solo Developers'], optimalWindow: 120 },

      // PRIME TIME BUSINESS - Multi-timezone LinkedIn evening
      { hour: 0, time: '00:00+1 Paris (18:00 EST)', action: 'LinkedIn EST evening', postTitle: 'East Coast CTOs: End-of-day API reality check', media: 'LinkedIn', personas: ['CTOs/Founders'], optimalWindow: 90 },
      { hour: 0, time: '00:00+1 Paris (17:00 CST)', action: 'LinkedIn CST evening', postTitle: 'Startup Teams: 3 API mistakes costing you $10K/month', media: 'LinkedIn', personas: ['Startup Teams'], optimalWindow: 90 },

      // NIGHT OWL COVERAGE - Late evening engagement
      { hour: 1, time: '01:00+1 Paris (19:00 EST)', action: 'Twitter EST evening', postTitle: 'East Coast devs: That feeling when all APIs return 200 OK', media: 'Twitter/X', personas: ['Solo Developers'], optimalWindow: 120 },
      { hour: 1, time: '01:00+1 Paris (18:00 CST)', action: 'Twitter CST evening', postTitle: 'Central time devs: Evening coding with unified APIs', media: 'Twitter/X', personas: ['Solo Developers'], optimalWindow: 120 },
      { hour: 1, time: '01:00+1 Paris (16:00 PST)', action: 'Indie Hackers PST', postTitle: 'Silicon Valley makers: API consolidation success story', media: 'Indie Hackers', personas: ['Solo Developers'], optimalWindow: 120 },

      // LATE NIGHT SUPPORT - Developer communities
      { hour: 2, time: '02:00+1 Paris (20:00 EST)', action: 'Discord EST night', postTitle: 'Live help: Debugging API integration issues', media: 'Discord', personas: ['Solo Developers'], optimalWindow: 180 },
      { hour: 2, time: '02:00+1 Paris (17:00 PST)', action: 'LinkedIn PST evening', postTitle: 'West Coast CTOs: API strategy for scaling teams', media: 'LinkedIn', personas: ['CTOs/Founders'], optimalWindow: 90 },
      { hour: 3, time: '03:00+1 Paris (19:00 CST)', action: 'Discord CST night', postTitle: 'Central time devs: API architecture deep dive', media: 'Discord', personas: ['Solo Developers'], optimalWindow: 180 },
      { hour: 3, time: '03:00+1 Paris (18:00 PST)', action: 'Twitter PST evening', postTitle: 'West Coast evening: API success stories', media: 'Twitter/X', personas: ['Solo Developers', 'Startup Teams'], optimalWindow: 120 },

      // EMAIL SEQUENCES - Optimal email times per timezone
      { hour: 4, time: '04:00+1 Paris (22:00 EST)', action: 'Email EST night', postTitle: 'Solo Developer Alert: Your API stack is about to break', media: 'Email Mautic', personas: ['Solo Developers'], optimalWindow: 120 },
      { hour: 4, time: '04:00+1 Paris (19:00 CST)', action: 'Discord PST evening', postTitle: 'West Coast devs: Evening API troubleshooting', media: 'Discord', personas: ['Solo Developers'], optimalWindow: 180 },
      { hour: 5, time: '05:00+1 Paris (22:00 CST)', action: 'Email CST night', postTitle: 'Midwest Developer Brief: API trends that matter', media: 'Email Mautic', personas: ['Solo Developers'], optimalWindow: 120 },
      { hour: 5, time: '05:00+1 Paris (20:00 PST)', action: 'Email PST evening', postTitle: 'CTO Evening Brief: West Coast API strategy', media: 'Email Mautic', personas: ['CTOs/Founders'], optimalWindow: 90 }
    ];

    // Add priority, efficiency, and date based on current time
    dailySchedule.forEach(item => {
      const actionTime = item.hour * 60; // Convert to minutes
      let timeDiff, isToday = true, actionDate = today;
      
      // Handle day wrap-around for 24h format
      if (actionTime >= currentTime) {
        timeDiff = actionTime - currentTime; // Same day
      } else {
        timeDiff = (24 * 60 - currentTime) + actionTime; // Next day
        isToday = false;
        actionDate = tomorrow;
      }
      
      const hourDiff = Math.floor(timeDiff / 60);
      const minuteDiff = timeDiff % 60;
      
      // Calculate efficiency based on optimal window
      let efficiency = 100;
      let efficiencyTrend = 'stable'; // 'up', 'down', 'stable'
      
      if (timeDiff < 0) {
        // Past optimal time - efficiency decreases over time
        const pastTime = Math.abs(timeDiff);
        efficiencyTrend = 'down'; // Temps passé = efficacité diminue
        if (pastTime <= item.optimalWindow) {
          // Still in optimal window
          efficiency = Math.max(20, 100 - (pastTime / item.optimalWindow) * 60);
        } else {
          // Past optimal window
          efficiency = Math.max(5, 20 - ((pastTime - item.optimalWindow) / 60) * 5);
        }
      } else if (timeDiff > 0) {
        // Future time - efficiency increases as we get closer
        const futureTime = timeDiff;
        efficiencyTrend = 'up'; // Se rapproche = efficacité augmente
        if (futureTime <= 60) {
          // Within 1 hour - high efficiency
          efficiency = Math.max(85, 100 - (futureTime / 60) * 15);
        } else if (futureTime <= 180) {
          // 1-3 hours - medium efficiency  
          efficiency = Math.max(60, 85 - ((futureTime - 60) / 120) * 25);
        } else {
          // More than 3 hours - lower efficiency
          efficiency = Math.max(30, 60 - ((futureTime - 180) / 360) * 30);
        }
      } else {
        // Moment optimal = stable
        efficiencyTrend = 'stable';
      }
      
      // Set priority based on time difference
      let priority = 'SCHEDULED';
      let status = 'SCHEDULED';
      
      if (hourDiff <= 0 && minuteDiff <= 0) {
        // Time has passed
        if (Math.abs(timeDiff) <= item.optimalWindow) {
          priority = 'ACTIVE';
          status = 'IN_WINDOW';
        } else {
          priority = 'PASSED';
          status = 'MISSED';
        }
      } else if (hourDiff <= 1) {
        priority = 'URGENT';
        status = 'URGENT';
      } else if (hourDiff <= 3) {
        priority = 'UPCOMING';
        status = 'UPCOMING';
      }
      
      // Calculate timezone and local time based on action
      const getActionTimezone = () => {
        if (item.action.includes('EST') || item.action.includes('morning') || item.action.includes('workday')) return 'EST';
        if (item.action.includes('CST')) return 'CST';
        if (item.action.includes('PST')) return 'PST';
        return 'EST'; // Default
      };
      
      const getLocalTime = () => {
        const tz = getActionTimezone();
        const parisHour = item.hour;
        if (tz === 'EST') return `${(parisHour - 6 + 24) % 24}:00 EST`;
        if (tz === 'CST') return `${(parisHour - 7 + 24) % 24}:00 CST`;
        if (tz === 'PST') return `${(parisHour - 9 + 24) % 24}:00 PST`;
        return `${(parisHour - 6 + 24) % 24}:00 EST`;
      };
      
      // Ratings based on platform and time
      const getRatings = () => {
        const ratings = { weekday: 4, weekend: 3, conversion: 4, automation: 5 };
        
        if (item.media === 'LinkedIn') {
          ratings.weekday = 5; ratings.weekend = 2; ratings.conversion = 5; ratings.automation = 4;
        } else if (item.media === 'Twitter/X') {
          ratings.weekday = 4; ratings.weekend = 4; ratings.conversion = 3; ratings.automation = 5;
        } else if (item.media === 'Dev.to') {
          ratings.weekday = 5; ratings.weekend = 5; ratings.conversion = 4; ratings.automation = 3;
        } else if (item.media === 'Discord') {
          ratings.weekday = 3; ratings.weekend = 4; ratings.conversion = 3; ratings.automation = 2;
        } else if (item.media === 'Hacker News') {
          ratings.weekday = 5; ratings.weekend = 3; ratings.conversion = 5; ratings.automation = 2;
        } else if (item.media === 'Reddit') {
          ratings.weekday = 4; ratings.weekend = 5; ratings.conversion = 3; ratings.automation = 3;
        } else if (item.media === 'Email Mautic') {
          ratings.weekday = 5; ratings.weekend = 4; ratings.conversion = 5; ratings.automation = 5;
        }
        
        return ratings;
      };
      
      const actionTimezone = getActionTimezone();
      const localTime = getLocalTime();
      const ratings = getRatings();

      actions.push({
        ...item,
        date: formatDate(actionDate),
        isToday,
        priority,
        status,
        efficiency: Math.round(efficiency),
        efficiencyTrend,
        timeDiff,
        hourDiff,
        minuteDiff,
        isPassed: timeDiff < 0,
        isInWindow: Math.abs(timeDiff) <= item.optimalWindow,
        timeUntil: timeDiff > 0 ? `${Math.floor(timeDiff / 60)}h ${timeDiff % 60}m` : null,
        timeSince: timeDiff < 0 ? `${Math.floor(Math.abs(timeDiff) / 60)}h ${Math.abs(timeDiff) % 60}m ago` : null,
        // Critical fix: Add isNext6Hours logic
        isNext6Hours: timeDiff > 0 && timeDiff <= 360, // 6 hours = 360 minutes
        // New enriched data
        timezone: actionTimezone,
        localTime: localTime,
        weekdayRating: ratings.weekday,
        weekendRating: ratings.weekend,
        conversionPotential: ratings.conversion,
        automationReady: ratings.automation,
        // Lead generation potential
        ...getLeadPotential(item.media, item.personas[0], actionTimezone)
      });
    });

    // Sort by priority (URGENT first), then by efficiency (higher first), then by time
    return actions.sort((a, b) => {
      // Priority order: URGENT > ACTIVE > UPCOMING > SCHEDULED > PASSED
      const priorityOrder = { 
        'URGENT': 0, 
        'ACTIVE': 1, 
        'UPCOMING': 2, 
        'SCHEDULED': 3, 
        'PASSED': 4 
      };
      
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      
      // Within same priority, sort by efficiency (higher first)
      if (a.efficiency !== b.efficiency) {
        return b.efficiency - a.efficiency;
      }
      
      // Finally sort by time
      return a.timeDiff - b.timeDiff;
    });
  };

  // Analog clock component
  const AnalogClock = ({ timezone, city, zoneName }) => {
    const time = getTimezoneTime(timezone);
    const [hours, minutes] = time.split(':').map(Number);
    
    // Calculate angles for hands
    const minuteAngle = (minutes * 6) - 90; // 360/60 = 6 degrees per minute
    const hourAngle = ((hours % 12) * 30 + minutes * 0.5) - 90; // 360/12 = 30 degrees per hour
    
    return (
      <div className="analog-clock">
        <div className="clock-face">
          <svg viewBox="0 0 200 200" className="clock-svg">
            {/* Clock face */}
            <circle cx="100" cy="100" r="95" fill="white" stroke="#333" strokeWidth="2"/>
            
            {/* Hour markers */}
            {[...Array(12)].map((_, i) => {
              const angle = (i * 30) * Math.PI / 180;
              const x1 = 100 + 80 * Math.cos(angle);
              const y1 = 100 + 80 * Math.sin(angle);
              const x2 = 100 + 70 * Math.cos(angle);
              const y2 = 100 + 70 * Math.sin(angle);
              return (
                <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#333" strokeWidth="2"/>
              );
            })}
            
            {/* Hour numbers */}
            {[...Array(12)].map((_, i) => {
              const hour = i === 0 ? 12 : i;
              const angle = (i * 30 - 90) * Math.PI / 180;
              const x = 100 + 60 * Math.cos(angle);
              const y = 100 + 60 * Math.sin(angle) + 5;
              return (
                <text key={i} x={x} y={y} textAnchor="middle" fontSize="12" fontWeight="bold" fill="#333">
                  {hour}
                </text>
              );
            })}
            
            {/* Hour hand */}
            <line 
              x1="100" 
              y1="100" 
              x2={100 + 50 * Math.cos(hourAngle * Math.PI / 180)} 
              y2={100 + 50 * Math.sin(hourAngle * Math.PI / 180)} 
              stroke="#333" 
              strokeWidth="4" 
              strokeLinecap="round"
            />
            
            {/* Minute hand */}
            <line 
              x1="100" 
              y1="100" 
              x2={100 + 70 * Math.cos(minuteAngle * Math.PI / 180)} 
              y2={100 + 70 * Math.sin(minuteAngle * Math.PI / 180)} 
              stroke="#666" 
              strokeWidth="2" 
              strokeLinecap="round"
            />
            
            {/* Center dot */}
            <circle cx="100" cy="100" r="5" fill="#333"/>
          </svg>
        </div>
        <div className="clock-info">
          <div className="clock-city">{city}</div>
          <div className="clock-digital">{time}</div>
          <div className="clock-zone">{zoneName}</div>
        </div>
      </div>
    );
  };

  // Function to get media icon
  const getMediaIcon = (media) => {
    const iconProps = {
      size: 16,
      strokeWidth: 2
    };
    
    const icon = (() => {
      switch (media) {
        case 'LinkedIn': return <Linkedin {...iconProps} color="#0077B5" />;
        case 'Twitter/X': return <Twitter {...iconProps} color="#1DA1F2" />;
        case 'Dev.to': return <Globe {...iconProps} color="#0A0A0A" />;
        case 'Discord': return <MessageCircle {...iconProps} color="#5865F2" />;
        case 'Hacker News': return <Newspaper {...iconProps} color="#FF6600" />;
        case 'Reddit': return <MessageSquare {...iconProps} color="#FF4500" />;
        case 'Email Mautic': return <Mail {...iconProps} color="#28A745" />;
        case 'Product Hunt': return <Zap {...iconProps} color="#DA552F" />;
        case 'Indie Hackers': return <Lightbulb {...iconProps} color="#1E90FF" />;
        default: return <Globe {...iconProps} color="#6C757D" />;
      }
    })();
    
    return <span title={media} style={{ display: 'inline-block' }}>{icon}</span>;
  };

  // Function to render stars based on rating
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={i <= rating ? 'star active' : 'star'}>
          ★
        </span>
      );
    }
    return <span className="star-rating">{stars}</span>;
  };

  const timingData = [
    // EMAIL SEQUENCES
    {
      media: 'Email Mautic',
      persona: 'Solo Developers',
      timezone: 'EST',
      timeParisOptimal: '23:00',
      timeLocal: '17:00 EST',
      weekdayRating: 4,
      weekendRating: 3,
      conversionPotential: 5,
      automationReady: 5,
      justification: 'Fin journée pros - consultation email peak'
    },
    {
      media: 'Email Mautic',
      persona: 'Startup Teams',
      timezone: 'CST',
      timeParisOptimal: '00:00+1',
      timeLocal: '18:00 CST',
      weekdayRating: 5,
      weekendRating: 2,
      conversionPotential: 5,
      automationReady: 5,
      justification: 'Transition bureau/domicile - forte consultation'
    },
    {
      media: 'Email Mautic',
      persona: 'CTOs/Founders',
      timezone: 'PST',
      timeParisOptimal: '02:00+1',
      timeLocal: '18:00 PST',
      weekdayRating: 5,
      weekendRating: 3,
      conversionPotential: 5,
      automationReady: 5,
      justification: 'Tech industry SF/Seattle context'
    },

    // LINKEDIN BUSINESS
    {
      media: 'LinkedIn',
      persona: 'CTOs/Founders',
      timezone: 'EST',
      timeParisOptimal: '17:00',
      timeLocal: '11:00 EST',
      weekdayRating: 5,
      weekendRating: 2,
      conversionPotential: 5,
      automationReady: 4,
      justification: 'Business hours peak - executives actifs'
    },
    {
      media: 'LinkedIn',
      persona: 'Startup Teams',
      timezone: 'CST',
      timeParisOptimal: '18:00',
      timeLocal: '12:00 CST',
      weekdayRating: 5,
      weekendRating: 2,
      conversionPotential: 4,
      automationReady: 4,
      justification: 'Midwest business hours - pragmatisme'
    },
    {
      media: 'LinkedIn',
      persona: 'CTOs/Founders',
      timezone: 'PST',
      timeParisOptimal: '20:00',
      timeLocal: '11:00 PST',
      weekdayRating: 5,
      weekendRating: 2,
      conversionPotential: 5,
      automationReady: 4,
      justification: 'Silicon Valley business peak'
    },

    // REDDIT DEVELOPERS
    {
      media: 'Reddit',
      persona: 'Solo Developers',
      timezone: 'EST',
      timeParisOptimal: '20:00',
      timeLocal: '14:00 EST',
      weekdayRating: 4,
      weekendRating: 5,
      conversionPotential: 4,
      automationReady: 3,
      justification: 'Afternoon engagement peak - développeurs'
    },
    {
      media: 'Reddit',
      persona: 'Solo Developers',
      timezone: 'CST',
      timeParisOptimal: '21:00',
      timeLocal: '15:00 CST',
      weekdayRating: 4,
      weekendRating: 5,
      conversionPotential: 4,
      automationReady: 3,
      justification: 'Afternoon peak - dev communities'
    },
    {
      media: 'Reddit',
      persona: 'Solo Developers',
      timezone: 'PST',
      timeParisOptimal: '23:00',
      timeLocal: '14:00 PST',
      weekdayRating: 4,
      weekendRating: 5,
      conversionPotential: 4,
      automationReady: 3,
      justification: 'West Coast dev communities'
    },

    // TWITTER/X TECH
    {
      media: 'Twitter/X',
      persona: 'Startup Teams',
      timezone: 'EST',
      timeParisOptimal: '01:00+1',
      timeLocal: '19:00 EST',
      weekdayRating: 4,
      weekendRating: 3,
      conversionPotential: 3,
      automationReady: 4,
      justification: 'Evening peak engagement - tech founders'
    },
    {
      media: 'Twitter/X',
      persona: 'CTOs/Founders',
      timezone: 'CST',
      timeParisOptimal: '02:00+1',
      timeLocal: '20:00 CST',
      weekdayRating: 4,
      weekendRating: 3,
      conversionPotential: 3,
      automationReady: 4,
      justification: 'Building in public - entrepreneurs'
    },
    {
      media: 'Twitter/X',
      persona: 'CTOs/Founders',
      timezone: 'PST',
      timeParisOptimal: '04:00+1',
      timeLocal: '20:00 PST',
      weekdayRating: 4,
      weekendRating: 3,
      conversionPotential: 4,
      automationReady: 4,
      justification: 'Valley founder network - night owls'
    },

    // DEV.TO & HACKER NEWS
    {
      media: 'Dev.to',
      persona: 'Solo Developers',
      timezone: 'EST',
      timeParisOptimal: '22:00',
      timeLocal: '16:00 EST',
      weekdayRating: 3,
      weekendRating: 5,
      conversionPotential: 3,
      automationReady: 4,
      justification: 'After-work dev traffic'
    },
    {
      media: 'Hacker News',
      persona: 'Solo Developers',
      timezone: 'PST',
      timeParisOptimal: '01:00+1',
      timeLocal: '16:00 PST',
      weekdayRating: 3,
      weekendRating: 4,
      conversionPotential: 4,
      automationReady: 2,
      justification: 'Silicon Valley ecosystem'
    },

    // PRODUCT HUNT
    {
      media: 'Product Hunt',
      persona: 'Startup Teams',
      timezone: 'EST',
      timeParisOptimal: '06:01',
      timeLocal: '00:01 EST',
      weekdayRating: 5,
      weekendRating: 3,
      conversionPotential: 4,
      automationReady: 5,
      justification: 'Daily reset optimal - early adopters'
    },
    {
      media: 'Product Hunt',
      persona: 'Solo Developers',
      timezone: 'PST',
      timeParisOptimal: '09:01',
      timeLocal: '01:01 PST',
      weekdayRating: 5,
      weekendRating: 3,
      conversionPotential: 4,
      automationReady: 5,
      justification: 'Daily reset + Silicon Valley mentions'
    },

    // DISCORD COMMUNITIES
    {
      media: 'Discord',
      persona: 'Solo Developers',
      timezone: 'EST',
      timeParisOptimal: '22:00-02:00+1',
      timeLocal: '16:00-20:00 EST',
      weekdayRating: 4,
      weekendRating: 5,
      conversionPotential: 3,
      automationReady: 3,
      justification: 'After-work community engagement'
    },

    // INDIE HACKERS
    {
      media: 'Indie Hackers',
      persona: 'Solo Developers',
      timezone: 'EST',
      timeParisOptimal: '00:00+1',
      timeLocal: '18:00 EST',
      weekdayRating: 3,
      weekendRating: 4,
      conversionPotential: 4,
      automationReady: 3,
      justification: 'Community evening peak'
    },
    {
      media: 'Indie Hackers',
      persona: 'Solo Developers',
      timezone: 'PST',
      timeParisOptimal: '03:00+1',
      timeLocal: '21:00 PST',
      weekdayRating: 3,
      weekendRating: 4,
      conversionPotential: 4,
      automationReady: 3,
      justification: 'SF Bay Area makers - night owls'
    }
  ];

  // Filter data based on selections
  const filteredData = timingData.filter(item => {
    return (selectedPersona === 'all' || item.persona === selectedPersona) &&
           (selectedTimezone === 'all' || item.timezone === selectedTimezone);
  });

  const personas = ['Solo Developers', 'Startup Teams', 'CTOs/Founders'];
  const timezones = ['EST', 'CST', 'PST'];
  const medias = [...new Set(timingData.map(item => item.media))];

  return (
    <div className="media-timing-documentation">
      {/* Scrolling Actions Banner */}
      <div className="actions-banner">
        <div className="banner-content">
          <div className="scrolling-actions">
            {getAllDailyActions().filter(action => action.isNext6Hours).map((action, index) => (
              <div key={index} className={`banner-action ${action.priority.toLowerCase()}`}>
                {action.priority === 'URGENT' ? '🔥' : '⚡'} {action.time} - {action.action} ({action.media})
              </div>
            ))}
            {getAllDailyActions().filter(action => action.isNext6Hours).length === 0 && (
              <div className="banner-action">
                ⏰ Période calme - Prochaines actions dans 6h+ 
              </div>
            )}
          </div>
        </div>
      </div>

      {/* World Clocks Section */}
      <div className="world-clocks-section">
        
        <div className="clocks-grid">
          <AnalogClock 
            timezone="Europe/Paris" 
            city="Paris" 
            zoneName="CET/CEST" 
          />
          <AnalogClock 
            timezone="America/New_York" 
            city="New York" 
            zoneName="Eastern Time" 
          />
          <AnalogClock 
            timezone="America/Chicago" 
            city="Chicago" 
            zoneName="Central Time" 
          />
          <AnalogClock 
            timezone="America/Los_Angeles" 
            city="Los Angeles" 
            zoneName="Pacific Time" 
          />
        </div>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="filter-group">
          <label>Persona:</label>
          <select 
            value={selectedPersona} 
            onChange={(e) => setSelectedPersona(e.target.value)}
            className="filter-select"
          >
            <option value="all">Toutes les personas</option>
            {personas.map(persona => (
              <option key={persona} value={persona}>{persona}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Timezone:</label>
          <select 
            value={selectedTimezone} 
            onChange={(e) => setSelectedTimezone(e.target.value)}
            className="filter-select"
          >
            <option value="all">Toutes les timezones</option>
            {timezones.map(tz => (
              <option key={tz} value={tz}>{tz}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="summary-stats">
        <div className="stat-card">
          <div className="stat-number" style={{color: '#DC3545', fontSize: '1.5rem'}}>🔥 {getAllDailyActions().filter(a => a.priority === 'URGENT').length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-number" style={{color: '#28A745', fontSize: '1.5rem'}}>⚡ {getAllDailyActions().filter(a => a.priority === 'ACTIVE').length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-number" style={{color: '#FFC107', fontSize: '1.5rem'}}>⏰ {getAllDailyActions().filter(a => a.priority === 'UPCOMING').length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-number" style={{color: '#007BFF', fontSize: '1.5rem'}}>📊 {Math.round(getAllDailyActions().reduce((sum, a) => sum + a.efficiency, 0) / getAllDailyActions().length)}%</div>
        </div>
      </div>

      {/* Dynamic Priority Table */}
      <div className="timing-table-container" style={{
        overflowX: 'auto',
        width: '100%',
        maxHeight: '80vh',
        border: '1px solid #DEE2E6',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        background: '#FFFFFF'
      }}>
        <style>{`
          .priority-table td {
            text-align: center !important;
            vertical-align: middle !important;
            padding: 4px !important;
            font-size: 0.85rem !important;
            font-weight: normal !important;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
            line-height: 1.2 !important;
          }
          .priority-table .action-cell {
            text-align: left !important;
          }
          .priority-table td *,
          .priority-table td span,
          .priority-table td div,
          .priority-table .date-badge,
          .priority-table .date-info *,
          .priority-table .time-cell *,
          .priority-table .local-time-cell * {
            font-size: 0.85rem !important;
            font-weight: normal !important;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
            line-height: 1.2 !important;
            font-style: normal !important;
            text-transform: none !important;
          }
          .priority-table .action-title {
            font-weight: bold !important;
          }
          .priority-table .post-title {
            font-style: italic !important;
          }
          .priority-table .status-indicator {
            font-size: 0.75rem !important;
            font-weight: normal !important;
            padding: 6px 8px !important;
            white-space: nowrap !important;
            display: inline-block !important;
            border-radius: 3px !important;
            min-width: 110px !important;
            text-align: center !important;
            line-height: 1.3 !important;
            height: auto !important;
            vertical-align: middle !important;
            box-sizing: border-box !important;
          }
        `}</style>
        <div className="priority-info">
          <div className="current-time">Heure Paris: {getTimezoneTime('Europe/Paris')}</div>
          <div className="legend">
            <span className="legend-item urgent">🔥 URGENT (&lt;2h)</span>
            <span className="legend-item active">⚡ ACTIVE (fenêtre optimale)</span>
            <span className="legend-item upcoming">⏰ PROCHAINE (&lt;3h)</span>
            <span className="legend-item scheduled">📅 PLANIFIÉ</span>
            <span className="legend-item passed">✅ PASSÉ</span>
          </div>
        </div>
        
        <table className="priority-table" style={{
          width: '100%',
          minWidth: '945px',
          tableLayout: 'fixed',
          overflowX: 'auto',
          borderCollapse: 'collapse'
        }}>
          <thead>
            <tr>
              <th style={{width: '70px', minWidth: '70px', padding: '6px 4px', fontSize: '0.65rem', textAlign: 'center', verticalAlign: 'middle'}}>Date</th>
              <th style={{width: '50px', minWidth: '50px', padding: '6px 4px', fontSize: '0.65rem', textAlign: 'center', verticalAlign: 'middle'}}>Média</th>
              <th style={{width: '90px', minWidth: '90px', padding: '6px 4px', fontSize: '0.65rem', textAlign: 'center', verticalAlign: 'middle'}}>Personas</th>
              <th style={{width: '70px', minWidth: '70px', padding: '6px 4px', fontSize: '0.65rem', textAlign: 'center', verticalAlign: 'middle'}}>Paris</th>
              <th style={{width: '70px', minWidth: '70px', padding: '6px 4px', fontSize: '0.65rem', textAlign: 'center', verticalAlign: 'middle'}}>Local</th>
              <th style={{width: '250px', minWidth: '250px', padding: '6px 4px', fontSize: '0.65rem', textAlign: 'center', verticalAlign: 'middle'}}>Contenu</th>
              <th style={{width: '55px', minWidth: '55px', padding: '6px 4px', fontSize: '0.65rem', textAlign: 'center', verticalAlign: 'middle'}}>Priorité</th>
              <th style={{width: '65px', minWidth: '65px', padding: '6px 4px', fontSize: '0.65rem', textAlign: 'center', verticalAlign: 'middle'}}>Efficacité</th>
              <th style={{width: '35px', minWidth: '35px', padding: '6px 2px', fontSize: '0.65rem', textAlign: 'center', verticalAlign: 'middle'}}>Sem.</th>
              <th style={{width: '35px', minWidth: '35px', padding: '6px 2px', fontSize: '0.65rem', textAlign: 'center', verticalAlign: 'middle'}}>WE</th>
              <th style={{width: '35px', minWidth: '35px', padding: '6px 2px', fontSize: '0.65rem', textAlign: 'center', verticalAlign: 'middle'}}>Conv.</th>
              <th style={{width: '35px', minWidth: '35px', padding: '6px 2px', fontSize: '0.65rem', textAlign: 'center', verticalAlign: 'middle'}}>Auto.</th>
              <th style={{width: '55px', minWidth: '55px', padding: '6px 2px', fontSize: '0.65rem', textAlign: 'center', verticalAlign: 'middle'}}>Reach</th>
              <th style={{width: '45px', minWidth: '45px', padding: '6px 2px', fontSize: '0.65rem', textAlign: 'center', verticalAlign: 'middle'}}>Leads</th>
              <th style={{width: '45px', minWidth: '45px', padding: '6px 2px', fontSize: '0.65rem', textAlign: 'center', verticalAlign: 'middle'}}>Conv%</th>
              <th style={{width: '65px', minWidth: '65px', padding: '6px 2px', fontSize: '0.65rem', textAlign: 'center', verticalAlign: 'middle'}}>Revenue€</th>
            </tr>
          </thead>
          <tbody>
            {getAllDailyActions().map((action, index) => (
              <tr key={index} className={`priority-row priority-${action.priority.toLowerCase()} ${action.isPassed ? 'passed' : ''}`} style={{height: '45px', verticalAlign: 'middle'}}>
                <td className="date-cell">
                  <div className="date-info">
                    <div className="date-day" >{action.date}</div>
                    {action.isToday ? 
                      <span className="date-badge today">Aujourd'hui</span> : 
                      <span className="date-badge tomorrow">Demain</span>
                    }
                  </div>
                </td>
                <td className="platform-cell">
                  <div 
                    className="media-icon" 
                    style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer' }}
                  >
                    {getMediaIcon(action.media)}
                  </div>
                </td>
                <td className="personas-cell">
                  <div className="personas-info">
                    {action.personas.map(persona => (
                      <span key={persona} className="persona-tag" style={{
                        background: '#E9ECEF', 
                        color: '#495057', 
                        padding: '1px 3px', 
                        borderRadius: '2px', 
                            marginRight: '2px',
                        display: 'inline-block',
                        marginBottom: '1px'
                      }}>{persona}</span>
                    ))}
                  </div>
                </td>
                <td className="paris-time-cell">
                  <div className="time-info">
                    <div className="scheduled-time" >
                      {String(action.hour).padStart(2, '0')}:00
                    </div>
                    {action.timeUntil && <div className="time-until" style={{color: '#6C757D'}}>Dans {action.timeUntil}</div>}
                    {action.timeSince && <div className="time-since" style={{color: '#6C757D'}}>{action.timeSince}</div>}
                  </div>
                </td>
                <td className="local-time-cell">
                  <div className="local-time" >{action.localTime || '11:00 EST'}</div>
                </td>
                <td className="action-cell">
                  <div className="action-content">
                    <div className="action-title" style={{fontWeight: 'bold', marginBottom: '2px'}}>{action.action}</div>
                    <div className="post-title" style={{color: '#6C757D', fontStyle: 'italic', marginBottom: '2px'}}>
                      "{action.postTitle}"
                    </div>
                    <div className="action-personas">
                      {action.personas.map(persona => (
                        <span key={persona} className="persona-tag-small" style={{
                          background: '#E9ECEF', 
                          color: '#495057', 
                          padding: '1px 3px', 
                          borderRadius: '2px', 
                          marginRight: '2px',
                          display: 'inline-block',
                          marginBottom: '1px'
                        }}>{persona}</span>
                      ))}
                    </div>
                  </div>
                </td>
                <td className="priority-cell">
                  <span className="priority-emoji" style={{fontSize: '1.2rem'}}>
                    {action.priority === 'URGENT' ? '🔥' : 
                     action.priority === 'ACTIVE' ? '⚡' :
                     action.priority === 'UPCOMING' ? '⏰' :
                     action.priority === 'SCHEDULED' ? '📅' :
                     '✅'}
                  </span>
                </td>
                <td className="efficiency-cell">
                  <div className="efficiency-percentage" style={{
                    color: action.efficiency >= 80 ? '#28A745' : action.efficiency >= 50 ? '#FFC107' : '#DC3545',
                    fontWeight: '900 !important',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '2px'
                  }}>
                    {action.efficiency}%
                    <span style={{ 
                      fontSize: '0.8rem',
                      color: action.efficiency >= 80 ? '#28A745' : action.efficiency >= 50 ? '#FFC107' : '#DC3545',
                      fontWeight: '900 !important'
                    }}>
                      {action.efficiencyTrend === 'up' ? '↗' : 
                       action.efficiencyTrend === 'down' ? '↘' : 
                       '→'}
                    </span>
                  </div>
                </td>
                <td className="rating-cell">
                  {renderStars(action.weekdayRating || 4)}
                </td>
                <td className="rating-cell">
                  {renderStars(action.weekendRating || 3)}
                </td>
                <td className="rating-cell">
                  {renderStars(action.conversionPotential || 4)}
                </td>
                <td className="rating-cell">
                  {renderStars(action.automationReady || 5)}
                </td>
                <td className="leads-cell" style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#059669' }}>
                  {action.estimatedReach ? `${(action.estimatedReach/1000).toFixed(0)}K` : 'N/A'}
                </td>
                <td className="leads-cell" style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#DC2626' }}>
                  {action.potentialLeads || 'N/A'}
                </td>
                <td className="leads-cell" style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#F59E0B' }}>
                  {action.conversionRate ? `${action.conversionRate}%` : 'N/A'}
                </td>
                <td className="leads-cell" style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#7C3AED' }}>
                  {action.revenueEstimate ? `€${(action.revenueEstimate/1000).toFixed(0)}K` : 'N/A'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        <div className="table-footer">
          <div className="footer-stats">
            <span>Actions urgentes: {getAllDailyActions().filter(a => a.priority === 'URGENT').length}</span>
            <span>Actions actives: {getAllDailyActions().filter(a => a.priority === 'ACTIVE').length}</span>
            <span>Prochaines: {getAllDailyActions().filter(a => a.priority === 'UPCOMING').length}</span>
            <span style={{color: '#059669', fontWeight: 'bold'}}>
              Total Reach: {((getAllDailyActions().reduce((sum, a) => sum + (a.estimatedReach || 0), 0))/1000).toFixed(0)}K
            </span>
            <span style={{color: '#DC2626', fontWeight: 'bold'}}>
              Total Leads: {getAllDailyActions().reduce((sum, a) => sum + (a.potentialLeads || 0), 0)}
            </span>
            <span style={{color: '#7C3AED', fontWeight: 'bold'}}>
              Revenue Potential: €{((getAllDailyActions().reduce((sum, a) => sum + (a.revenueEstimate || 0), 0))/1000).toFixed(0)}K
            </span>
          </div>
          <small>Mis à jour automatiquement chaque minute | Focus sur les 3 premières lignes</small>
        </div>
      </div>

      {/* Cascade Strategy Visual */}
      <div className="cascade-strategy">
        <h2>🚀 Stratégie Cascade Multi-Timezone</h2>
        
        <div className="cascade-phases">
          <div className="phase-card phase-1">
            <div className="phase-header">
              <h3>Phase 1: EST Focus</h3>
              <div className="phase-time">14:00 - 23:00 Paris</div>
            </div>
            <div className="phase-actions">
              <div className="action-item">
                <span className="action-time">17:00</span>
                <span className="action-desc">LinkedIn Business (EST 11:00)</span>
                {renderStars(5)}
              </div>
              <div className="action-item">
                <span className="action-time">20:00</span>
                <span className="action-desc">Reddit Dev Communities (EST 14:00)</span>
                {renderStars(4)}
              </div>
              <div className="action-item">
                <span className="action-time">22:00</span>
                <span className="action-desc">Dev.to Technical (EST 16:00)</span>
                {renderStars(3)}
              </div>
              <div className="action-item">
                <span className="action-time">23:00</span>
                <span className="action-desc">Email Optimal (EST 17:00)</span>
                {renderStars(5)}
              </div>
            </div>
          </div>

          <div className="phase-card phase-2">
            <div className="phase-header">
              <h3>Phase 2: CST Focus</h3>
              <div className="phase-time">15:00 - 02:00+1 Paris</div>
            </div>
            <div className="phase-actions">
              <div className="action-item">
                <span className="action-time">18:00</span>
                <span className="action-desc">LinkedIn Midwest (CST 12:00)</span>
                {renderStars(5)}
              </div>
              <div className="action-item">
                <span className="action-time">21:00</span>
                <span className="action-desc">Reddit Central (CST 15:00)</span>
                {renderStars(4)}
              </div>
              <div className="action-item">
                <span className="action-time">00:00+1</span>
                <span className="action-desc">Email Transition (CST 18:00)</span>
                {renderStars(5)}
              </div>
              <div className="action-item">
                <span className="action-time">02:00+1</span>
                <span className="action-desc">Twitter/X Build (CST 20:00)</span>
                {renderStars(4)}
              </div>
            </div>
          </div>

          <div className="phase-card phase-3">
            <div className="phase-header">
              <h3>Phase 3: PST Focus</h3>
              <div className="phase-time">17:00 - 05:00+1 Paris</div>
            </div>
            <div className="phase-actions">
              <div className="action-item">
                <span className="action-time">20:00</span>
                <span className="action-desc">LinkedIn Valley (PST 11:00)</span>
                {renderStars(5)}
              </div>
              <div className="action-item">
                <span className="action-time">23:00</span>
                <span className="action-desc">Reddit West Coast (PST 14:00)</span>
                {renderStars(4)}
              </div>
              <div className="action-item">
                <span className="action-time">01:00+1</span>
                <span className="action-desc">Hacker News Valley (PST 16:00)</span>
                {renderStars(4)}
              </div>
              <div className="action-item">
                <span className="action-time">02:00+1</span>
                <span className="action-desc">Email Tech Industry (PST 17:00)</span>
                {renderStars(5)}
              </div>
              <div className="action-item">
                <span className="action-time">04:00+1</span>
                <span className="action-desc">Twitter/X Night Owls (PST 20:00)</span>
                {renderStars(4)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sweet Spot Analysis */}
      <div className="sweet-spot-analysis">
        <h2>🎯 Sweet Spots Globaux</h2>
        
        <div className="sweet-spot-grid">
          <div className="sweet-spot-card optimal">
            <div className="sweet-spot-time">23:00 Paris</div>
            <div className="sweet-spot-coverage">
              <div>EST 17:00 {renderStars(5)}</div>
              <div>CST 17:00 {renderStars(4)}</div>
              <div>PST 14:00 {renderStars(4)}</div>
            </div>
            <div className="sweet-spot-label">OPTIMAL GLOBAL</div>
          </div>

          <div className="sweet-spot-card good">
            <div className="sweet-spot-time">20:00 Paris</div>
            <div className="sweet-spot-coverage">
              <div>EST 14:00 {renderStars(4)}</div>
              <div>CST 14:00 {renderStars(4)}</div>
              <div>PST 11:00 {renderStars(5)}</div>
            </div>
            <div className="sweet-spot-label">BUSINESS OPTIMAL</div>
          </div>

          <div className="sweet-spot-card good">
            <div className="sweet-spot-time">02:00+1 Paris</div>
            <div className="sweet-spot-coverage">
              <div>EST 20:00 {renderStars(3)}</div>
              <div>CST 20:00 {renderStars(4)}</div>
              <div>PST 17:00 {renderStars(5)}</div>
            </div>
            <div className="sweet-spot-label">EVENING OPTIMAL</div>
          </div>
        </div>
      </div>

      {/* Success Metrics */}
      <div className="success-metrics">
        <h2>📈 Métriques de Succès Attendues</h2>
        
        <div className="metrics-grid">
          <div className="metric-card">
            <div className="metric-title">Email Mautic</div>
            <div className="metric-targets">
              <div className="metric-item">
                <span>Open Rate:</span>
                <span>25-35%</span>
              </div>
              <div className="metric-item">
                <span>Click Rate:</span>
                <span>5-8%</span>
              </div>
              <div className="metric-item">
                <span>Conversion:</span>
                <span>15-20%</span>
              </div>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-title">LinkedIn Business</div>
            <div className="metric-targets">
              <div className="metric-item">
                <span>Engagement:</span>
                <span>2-4%</span>
              </div>
              <div className="metric-item">
                <span>Click Rate:</span>
                <span>0.5-1%</span>
              </div>
              <div className="metric-item">
                <span>Lead Quality:</span>
                <span>8/10</span>
              </div>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-title">Reddit Communities</div>
            <div className="metric-targets">
              <div className="metric-item">
                <span>Upvote Ratio:</span>
                <span>70%+</span>
              </div>
              <div className="metric-item">
                <span>Comments:</span>
                <span>20+</span>
              </div>
              <div className="metric-item">
                <span>Traffic:</span>
                <span>2-5%</span>
              </div>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-title">Product Hunt</div>
            <div className="metric-targets">
              <div className="metric-item">
                <span>Daily Ranking:</span>
                <span>Top 10</span>
              </div>
              <div className="metric-item">
                <span>Hunters:</span>
                <span>100+</span>
              </div>
              <div className="metric-item">
                <span>Traffic:</span>
                <span>500+</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="documentation-footer">
        <p>
          <strong>Dernière mise à jour:</strong> {new Date().toLocaleDateString('fr-FR')} 
          | <strong>Source:</strong> Analyse des documents GROWTH_HACKING + BUSINESS-PLAN-CHALLENGE
          | <strong>Optimisation:</strong> Timing scientifique multi-timezone USA/Canada anglophone
        </p>
      </div>

      {/* Actions Modal */}
      {showActionsModal && (
        <div className="modal-overlay" onClick={() => setShowActionsModal(false)}>
          <div className="modal-content priority-dashboard" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Dashboard Planning Dynamique - Tri Automatique</h3>
              <button 
                className="modal-close"
                onClick={() => setShowActionsModal(false)}
              >
                ×
              </button>
            </div>
            
            <div className="modal-body">
              <div className="priority-info">
                <div className="current-time">Heure Paris: {getTimezoneTime('Europe/Paris')}</div>
                <div className="legend">
                  <span className="legend-item urgent">🔥 URGENT (&lt;2h)</span>
                  <span className="legend-item active">⚡ ACTIVE (fenêtre optimale)</span>
                  <span className="legend-item upcoming">⏰ PROCHAINE (&lt;3h)</span>
                  <span className="legend-item scheduled">📅 PLANIFIÉ</span>
                  <span className="legend-item passed">✅ PASSÉ</span>
                </div>
              </div>
              
              <div className="priority-table-container">
                <table className="priority-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Plateforme</th>
                      <th>Heure</th>
                      <th>Action</th>
                      <th>Priorité</th>
                      <th>Efficacité</th>
                      <th>Statut</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getAllDailyActions().map((action, index) => (
                      <tr key={index} className={`priority-row priority-${action.priority.toLowerCase()} ${action.isPassed ? 'passed' : ''}`}>
                        <td className="date-cell">
                          <div className="date-info">
                            <div className="date-day">{action.date}</div>
                            {action.isToday ? 
                              <span className="date-badge today">Aujourd'hui</span> : 
                              <span className="date-badge tomorrow">Demain</span>
                            }
                          </div>
                        </td>
                        <td className="platform-cell">
                          <span className={`platform-badge ${action.media.toLowerCase().replace(/[\s\/]/g, '-')}`}>
                            {action.media}
                          </span>
                        </td>
                        <td className="time-cell">
                          <div className="time-info">
                            <div className="scheduled-time">{action.time}</div>
                            {action.timeUntil && <div className="time-until">Dans {action.timeUntil}</div>}
                            {action.timeSince && <div className="time-since">{action.timeSince}</div>}
                          </div>
                        </td>
                        <td className="action-cell">
                          <div className="action-content">
                            <div className="action-title">{action.action}</div>
                            <div className="action-personas">
                              {action.personas.map(persona => (
                                <span key={persona} className="persona-tag-small">{persona}</span>
                              ))}
                            </div>
                          </div>
                        </td>
                        <td className="priority-cell">
                          <span className={`priority-badge ${action.priority.toLowerCase()}`}>
                            {action.priority === 'URGENT' ? '🔥 URGENT' : 
                             action.priority === 'ACTIVE' ? '⚡ ACTIVE' :
                             action.priority === 'UPCOMING' ? '⏰ PROCHAINE' :
                             action.priority === 'SCHEDULED' ? '📅 PLANIFIÉ' :
                             '✅ PASSÉ'}
                          </span>
                        </td>
                        <td className="efficiency-cell">
                          <div className="efficiency-info">
                            <div className="efficiency-percentage">{action.efficiency}%</div>
                            <div className="efficiency-bar">
                              <div 
                                className={`efficiency-fill ${action.efficiency >= 80 ? 'high' : action.efficiency >= 50 ? 'medium' : 'low'}`}
                                style={{ width: `${action.efficiency}%` }}
                              ></div>
                            </div>
                          </div>
                        </td>
                        <td className="status-cell">
                          <span className={`status-indicator ${action.status.toLowerCase()}`}>
                            {action.status === 'URGENT' ? 'Action requise' :
                             action.status === 'IN_WINDOW' ? 'Fenêtre active' :
                             action.status === 'UPCOMING' ? 'À préparer' :
                             action.status === 'SCHEDULED' ? 'Programmé' :
                             'Manqué'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="modal-footer">
              <div className="modal-info">
                <div className="footer-stats">
                  <span>Actions urgentes: {getAllDailyActions().filter(a => a.priority === 'URGENT').length}</span>
                  <span>Actions actives: {getAllDailyActions().filter(a => a.priority === 'ACTIVE').length}</span>
                  <span>Prochaines: {getAllDailyActions().filter(a => a.priority === 'UPCOMING').length}</span>
                </div>
                <small>Mis à jour automatiquement chaque minute | Focus sur les 3 premières lignes</small>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaTimingDocumentation;