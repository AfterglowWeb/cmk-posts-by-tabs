
export default function formatDateToFrench(dateString, options = {}) {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('fr-FR', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        ...options
      }).format(date);
    } catch (e) {
      console.error('Error formatting date:', e);
      return dateString;
    }
  }