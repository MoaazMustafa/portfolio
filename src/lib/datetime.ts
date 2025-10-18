import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import durationPlugin from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

// Initialize dayjs plugins
dayjs.extend(advancedFormat);
dayjs.extend(customParseFormat);
dayjs.extend(durationPlugin);
dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(timezone);

/**
 * Professional date and time formatting utility using dayjs
 *
 * Usage:
 * - dateTime.format(date, 'short') // "Dec 28, 2025"
 * - dateTime.relative(date) // "2 hours ago"
 * - dateTime.professional(date) // "December 28, 2025 at 2:30 PM EST"
 */
export const dateTime = {
  /**
   * Format date with predefined professional formats
   */
  format: (
    date: string | Date | dayjs.Dayjs,
    format:
      | 'short'
      | 'medium'
      | 'long'
      | 'full'
      | 'time'
      | 'datetime'
      | 'iso' = 'medium'
  ): string => {
    const d = dayjs(date);

    switch (format) {
      case 'short':
        return d.format('MMM D, YYYY'); // Dec 28, 2025
      case 'medium':
        return d.format('MMMM D, YYYY'); // December 28, 2025
      case 'long':
        return d.format('dddd, MMMM D, YYYY'); // Sunday, December 28, 2025
      case 'full':
        return d.format('dddd, MMMM D, YYYY [at] h:mm A'); // Sunday, December 28, 2025 at 2:30 PM
      case 'time':
        return d.format('h:mm A'); // 2:30 PM
      case 'datetime':
        return d.format('MMMM D, YYYY [at] h:mm A'); // December 28, 2025 at 2:30 PM
      case 'iso':
        return d.toISOString(); // 2025-12-28T14:30:00.000Z
      default:
        return d.format('MMMM D, YYYY');
    }
  },

  /**
   * Get relative time (e.g., "2 hours ago", "in 3 days")
   */
  relative: (date: string | Date | dayjs.Dayjs): string => {
    return dayjs(date).fromNow();
  },

  /**
   * Get relative time to a specific date
   */
  relativeTo: (
    date: string | Date | dayjs.Dayjs,
    to: string | Date | dayjs.Dayjs
  ): string => {
    return dayjs(date).from(dayjs(to));
  },

  /**
   * Professional datetime format with timezone
   */
  professional: (
    date: string | Date | dayjs.Dayjs,
    timezone?: string
  ): string => {
    const d = timezone ? dayjs(date).tz(timezone) : dayjs(date);
    const tz = timezone ? d.format('z') : '';
    return `${d.format('MMMM D, YYYY [at] h:mm A')}${tz ? ` ${tz}` : ''}`;
  },

  /**
   * Format for business/professional contexts
   */
  business: (date: string | Date | dayjs.Dayjs): string => {
    return dayjs(date).format('ddd, MMM D, YYYY [•] h:mm A'); // Mon, Dec 28, 2025 • 2:30 PM
  },

  /**
   * Calendar format (shows "Today", "Yesterday", "Tomorrow", or date)
   */
  calendar: (date: string | Date | dayjs.Dayjs): string => {
    const d = dayjs(date);
    const now = dayjs();

    if (d.isSame(now, 'day')) {
      return `Today at ${d.format('h:mm A')}`;
    } else if (d.isSame(now.subtract(1, 'day'), 'day')) {
      return `Yesterday at ${d.format('h:mm A')}`;
    } else if (d.isSame(now.add(1, 'day'), 'day')) {
      return `Tomorrow at ${d.format('h:mm A')}`;
    } else if (d.isAfter(now.subtract(7, 'days'))) {
      return d.format('dddd [at] h:mm A'); // Monday at 2:30 PM
    } else {
      return d.format('MMM D [at] h:mm A'); // Dec 28 at 2:30 PM
    }
  },

  /**
   * Duration between two dates in human readable format
   */
  duration: (
    start: string | Date | dayjs.Dayjs,
    end: string | Date | dayjs.Dayjs,
    format: 'precise' | 'approximate' = 'approximate'
  ): string => {
    const startDate = dayjs(start);
    const endDate = dayjs(end);
    const diff = endDate.diff(startDate);

    if (format === 'precise') {
      const duration = dayjs.duration(diff);
      const days = Math.floor(duration.asDays());
      const hours = duration.hours();
      const minutes = duration.minutes();

      if (days > 0) {
        return `${days}d ${hours}h ${minutes}m`;
      } else if (hours > 0) {
        return `${hours}h ${minutes}m`;
      } else {
        return `${minutes}m`;
      }
    } else {
      return endDate.from(startDate, true); // "2 hours"
    }
  },

  /**
   * Check if a date is within business hours (9 AM - 5 PM, Mon-Fri)
   */
  isBusinessHours: (
    date: string | Date | dayjs.Dayjs = new Date()
  ): boolean => {
    const d = dayjs(date);
    const hour = d.hour();
    const day = d.day(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

    return day >= 1 && day <= 5 && hour >= 9 && hour < 17;
  },

  /**
   * Get the start of business day (9 AM)
   */
  startOfBusinessDay: (
    date: string | Date | dayjs.Dayjs = new Date()
  ): dayjs.Dayjs => {
    return dayjs(date).hour(9).minute(0).second(0).millisecond(0);
  },

  /**
   * Get the end of business day (5 PM)
   */
  endOfBusinessDay: (
    date: string | Date | dayjs.Dayjs = new Date()
  ): dayjs.Dayjs => {
    return dayjs(date).hour(17).minute(0).second(0).millisecond(0);
  },

  /**
   * Custom format with dayjs format string
   */
  custom: (date: string | Date | dayjs.Dayjs, format: string): string => {
    return dayjs(date).format(format);
  },

  /**
   * Parse date from string with custom format
   */
  parse: (dateString: string, format: string): dayjs.Dayjs => {
    return dayjs(dateString, format);
  },

  /**
   * Get timezone-aware date
   */
  timezone: (date: string | Date | dayjs.Dayjs, tz: string): dayjs.Dayjs => {
    return dayjs(date).tz(tz);
  },

  /**
   * Check if date is valid
   */
  isValid: (date: string | Date | dayjs.Dayjs): boolean => {
    return dayjs(date).isValid();
  },

  /**
   * Get current date/time
   */
  now: (): dayjs.Dayjs => {
    return dayjs();
  },

  /**
   * Utility functions
   */
  utils: {
    /**
     * Get user's timezone
     */
    getUserTimezone: (): string => {
      return Intl.DateTimeFormat().resolvedOptions().timeZone;
    },

    /**
     * Get formatted time ago with smart granularity
     */
    smartRelative: (date: string | Date | dayjs.Dayjs): string => {
      const d = dayjs(date);
      const now = dayjs();
      const diffInMinutes = now.diff(d, 'minute');

      if (diffInMinutes < 1) {
        return 'Just now';
      } else if (diffInMinutes < 60) {
        return `${diffInMinutes}m ago`;
      } else if (diffInMinutes < 1440) {
        // Less than 24 hours
        return `${Math.floor(diffInMinutes / 60)}h ago`;
      } else if (diffInMinutes < 10080) {
        // Less than 7 days
        return `${Math.floor(diffInMinutes / 1440)}d ago`;
      } else {
        return d.format('MMM D, YYYY');
      }
    },

    /**
     * Get professional date range
     */
    dateRange: (
      start: string | Date | dayjs.Dayjs,
      end: string | Date | dayjs.Dayjs,
      format: 'short' | 'medium' | 'long' = 'medium'
    ): string => {
      const startDate = dayjs(start);
      const endDate = dayjs(end);

      if (startDate.isSame(endDate, 'day')) {
        return dateTime.format(startDate, format);
      }

      if (startDate.isSame(endDate, 'year')) {
        if (format === 'short') {
          return `${startDate.format('MMM D')} - ${endDate.format('MMM D, YYYY')}`;
        } else {
          return `${startDate.format('MMMM D')} - ${endDate.format('MMMM D, YYYY')}`;
        }
      }

      return `${dateTime.format(startDate, format)} - ${dateTime.format(endDate, format)}`;
    },
  },
};

// Export commonly used functions for convenience
export const {
  format,
  relative,
  professional,
  business,
  calendar,
  duration,
  isBusinessHours,
  now,
  utils,
} = dateTime;
