const domesticDocs = ['Aadhaar Card', 'PAN Card', 'Voter ID', 'Driving License'];
const internationalDocs = ['Passport', 'Visa', 'Flight Tickets', 'Hotel Bookings'];
const domesticDestinations = [
  "Taj Mahal, Agra",
  "Golden Temple, Amritsar",
  "Jaipur (Pink City)",
  "Goa Beaches",
  "Kerala Backwaters",
  "Mumbai",
  "Delhi",
  "Rishikesh",
  "Ladakh",
  "Udaipur",
  "Varanasi",
  "Mysore Palace",
  "Darjeeling",
  "Shimla",
  "Andaman Islands"
];

export const guestTourData = [
  {
    guestName: "Rajesh Kumar",
    destination: "Taj Mahal, Agra",
    tourStartMonth: "December",
    tourEndMonth: "December",
    arrivalDate: "15-Dec-2025",
    departureDate: "17-Dec-2025",
    balanceCollection: 15000,
    toBeCollected: 25000,
    collectedTillDate: 10000,
    profit: 5000,
    profitBookedTillDate: 2000,
    group: "A's Family",
    documents: domesticDocs.map(doc => ({
      name: doc,
      uploaded: Math.random() > 0.5,
      path: Math.random() > 0.5 ? `/fake/docs/${doc.replace(/\s+/g, '_').toLowerCase()}.pdf` : undefined
    }))
  },
  {
    guestName: "Priya Sharma",
    destination: "Goa Beaches",
    tourStartMonth: "December",
    tourEndMonth: "December",
    arrivalDate: "20-Dec-2025",
    departureDate: "25-Dec-2025",
    balanceCollection: 3000,
    toBeCollected: 35000,
    collectedTillDate: 32000,
    profit: 7000,
    profitBookedTillDate: 6400,
    group: "B's Friends",
    documents: domesticDocs.map(doc => ({
      name: doc,
      uploaded: Math.random() > 0.5,
      path: Math.random() > 0.5 ? `/fake/docs/${doc.replace(/\s+/g, '_').toLowerCase()}.pdf` : undefined
    }))
  },
  {
    guestName: "Amit Patel",
    destination: "Kerala Backwaters",
    tourStartMonth: "January",
    tourEndMonth: "January",
    arrivalDate: "10-Jan-2026",
    departureDate: "15-Jan-2026",
    balanceCollection: 22000,
    toBeCollected: 40000,
    collectedTillDate: 18000,
    profit: 8000,
    profitBookedTillDate: 3600,
    group: "Corporate tour by company ABC",
    documents: domesticDocs.map(doc => ({
      name: doc,
      uploaded: Math.random() > 0.5,
      path: Math.random() > 0.5 ? `/fake/docs/${doc.replace(/\s+/g, '_').toLowerCase()}.pdf` : undefined
    }))
  },
  {
    guestName: "Neha Gupta",
    destination: "Jaipur (Pink City)",
    tourStartMonth: "February",
    tourEndMonth: "February",
    arrivalDate: "05-Feb-2026",
    departureDate: "08-Feb-2026",
    balanceCollection: 8000,
    toBeCollected: 28000,
    collectedTillDate: 20000,
    profit: 5600,
    profitBookedTillDate: 4000,
    group: "School Trip Group",
    documents: domesticDocs.map(doc => ({
      name: doc,
      uploaded: Math.random() > 0.5,
      path: Math.random() > 0.5 ? `/fake/docs/${doc.replace(/\s+/g, '_').toLowerCase()}.pdf` : undefined
    }))
  },
  {
    guestName: "Rahul Singh",
    destination: "Mumbai",
    tourStartMonth: "March",
    tourEndMonth: "March",
    arrivalDate: "12-Mar-2026",
    departureDate: "16-Mar-2026",
    balanceCollection: 12000,
    toBeCollected: 32000,
    collectedTillDate: 20000,
    profit: 6400,
    profitBookedTillDate: 4000,
    group: "Wedding Party",
    documents: domesticDocs.map(doc => ({
      name: doc,
      uploaded: Math.random() > 0.5,
      path: Math.random() > 0.5 ? `/fake/docs/${doc.replace(/\s+/g, '_').toLowerCase()}.pdf` : undefined
    }))
  },
  {
    guestName: "Anjali Desai",
    destination: "Rishikesh",
    tourStartMonth: "April",
    tourEndMonth: "April",
    arrivalDate: "18-Apr-2026",
    departureDate: "22-Apr-2026",
    balanceCollection: 20000,
    toBeCollected: 45000,
    collectedTillDate: 25000,
    profit: 9000,
    profitBookedTillDate: 5000,
    group: "Adventure Seekers",
    documents: domesticDocs.map(doc => ({
      name: doc,
      uploaded: Math.random() > 0.5,
      path: Math.random() > 0.5 ? `/fake/docs/${doc.replace(/\s+/g, '_').toLowerCase()}.pdf` : undefined
    }))
  },
  {
    guestName: "Vikram Reddy",
    destination: "Ladakh",
    tourStartMonth: "May",
    tourEndMonth: "May",
    arrivalDate: "25-May-2026",
    departureDate: "30-May-2026",
    balanceCollection: 40000,
    toBeCollected: 55000,
    collectedTillDate: 15000,
    profit: 11000,
    profitBookedTillDate: 3000,
    group: "Business Conference",
    documents: domesticDocs.map(doc => ({
      name: doc,
      uploaded: Math.random() > 0.5,
      path: Math.random() > 0.5 ? `/fake/docs/${doc.replace(/\s+/g, '_').toLowerCase()}.pdf` : undefined
    }))
  },
  {
    guestName: "Sneha Iyer",
    destination: "Darjeeling",
    tourStartMonth: "June",
    tourEndMonth: "June",
    arrivalDate: "08-Jun-2026",
    departureDate: "12-Jun-2026",
    balanceCollection: 10000,
    toBeCollected: 30000,
    collectedTillDate: 20000,
    profit: 6000,
    profitBookedTillDate: 4000,
    group: "Family Reunion",
    documents: domesticDocs.map(doc => ({
      name: doc,
      uploaded: Math.random() > 0.5,
      path: Math.random() > 0.5 ? `/fake/docs/${doc.replace(/\s+/g, '_').toLowerCase()}.pdf` : undefined
    }))
  },
  {
    guestName: "Karan Malhotra",
    destination: "Udaipur",
    tourStartMonth: "July",
    tourEndMonth: "July",
    arrivalDate: "14-Jul-2026",
    departureDate: "18-Jul-2026",
    balanceCollection: 15000,
    toBeCollected: 38000,
    collectedTillDate: 23000,
    profit: 7600,
    profitBookedTillDate: 4600,
    group: "College Friends",
    documents: domesticDocs.map(doc => ({
      name: doc,
      uploaded: Math.random() > 0.5,
      path: Math.random() > 0.5 ? `/fake/docs/${doc.replace(/\s+/g, '_').toLowerCase()}.pdf` : undefined
    }))
  },
  {
    guestName: "Pooja Nair",
    destination: "Andaman Islands",
    tourStartMonth: "August",
    tourEndMonth: "August",
    arrivalDate: "22-Aug-2026",
    departureDate: "28-Aug-2026",
    balanceCollection: 18000,
    toBeCollected: 48000,
    collectedTillDate: 30000,
    profit: 9600,
    profitBookedTillDate: 6000,
    group: "Retirement Celebration",
    documents: domesticDocs.map(doc => ({
      name: doc,
      uploaded: Math.random() > 0.5,
      path: Math.random() > 0.5 ? `/fake/docs/${doc.replace(/\s+/g, '_').toLowerCase()}.pdf` : undefined
    }))
  },
];
export default guestTourData;
