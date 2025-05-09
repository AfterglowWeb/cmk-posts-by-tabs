import { format, parseISO, isValid } from 'date-fns';
import { fr } from 'date-fns/locale';

export function isValidDate (dateString) {

    if (dateString instanceof Date) {
        return isValid(dateString);
    }

    if (typeof dateString === 'string') {

        const isoFormatRegex = /^\d{4}-\d{2}-\d{2}(T.*)?$/;
        
        if (isoFormatRegex.test(dateString)) {
        const parsedDate = parseISO(dateString);
        return isValid(parsedDate);
        }
        
    }

    return false;
};


export function simplifyDateRange(start, end) {

    if (!start) {
        return null;
    }
    if (!end) {
        return [start, null];
    }
    let startParts = start.split(' ');
    let endParts = end.split(' ');

    for (let i = startParts.length; 0 <= i; i--) {
        if (startParts[i] == endParts[i]) {
            startParts[i] = '';
        } else {
            break;
        }
    }

    let newStart = startParts.filter(part => part !== '');
    if(newStart.length > 0) {
        newStart = newStart.join(' ');
    } else {
        newStart = null;
    }

    return [
        newStart,
        end,
    ]

}

export function formatDateRange(dateRange) {
    const { start, end } = dateRange;

    const formattedStart = format(start, 'd MMM yyyy', { locale: fr });
    const formattedEnd = end ? format(end, 'd MMM yyyy', { locale: fr }) : null;

    const fullFormattedStart = format(start, 'EEEE d MMMM yyyy', { locale: fr });
    const fullFormattedEnd = end ? format(end, 'EEEE d MMMM yyyy', { locale: fr }) : null;

    const [newStart, newEnd] = simplifyDateRange(formattedStart, formattedEnd);
    const [newFullStart, newFullEnd] = simplifyDateRange(fullFormattedStart, fullFormattedEnd);

    return {
        start: newStart,
        end: newEnd,
        fullStart: newFullStart,
        fullEnd: newFullEnd,
    }
}

export function formatPostDates(post) {
    const date = isValidDate(post.date) ? format(post.date, 'd MMM yyyy', { locale: fr }) : post.date;
    const modified = post.modified && isValidDate(post.modified) ? format(post.modified, 'd MMM yyyy', { locale: fr }) : null;
    const fullDate = isValidDate(post.date) ? format(post.date, 'EEEE d MMMM yyyy', { locale: fr }) : post.date;
    const fullModified = post.modified && isValidDate(post.modified) ? format(post.modified, 'EEEE d MMMM yyyy', { locale: fr }) : null;

    return {
        date: date,
        modified: modified,
        fullDate: fullDate,
        fullModified: fullModified 
    };
}

export function isCurrentEvent(dateRange) {
    const { start, end } = dateRange;
    const now = new Date();
    const startDate = new Date(start);

    let endDate;
    if (!end) {
        endDate = startDate;
        endDate.setHours(23, 59, 59);
    } else {
        endDate = new Date(end);
    }

    return startDate <= now && now <= endDate;
}