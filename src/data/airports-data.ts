// Comprehensive list of major airports worldwide with IATA codes
export interface Airport {
  code: string;
  name: string;
  city: string;
  country: string;
}

export const airports: Airport[] = [
  // India
  { code: "DEL", name: "Indira Gandhi International Airport", city: "New Delhi", country: "India" },
  { code: "BOM", name: "Chhatrapati Shivaji Maharaj International Airport", city: "Mumbai", country: "India" },
  { code: "BLR", name: "Kempegowda International Airport", city: "Bengaluru", country: "India" },
  { code: "HYD", name: "Rajiv Gandhi International Airport", city: "Hyderabad", country: "India" },
  { code: "MAA", name: "Chennai International Airport", city: "Chennai", country: "India" },
  { code: "CCU", name: "Netaji Subhas Chandra Bose International Airport", city: "Kolkata", country: "India" },
  { code: "AMD", name: "Sardar Vallabhbhai Patel International Airport", city: "Ahmedabad", country: "India" },
  { code: "PNQ", name: "Pune Airport", city: "Pune", country: "India" },
  { code: "GOI", name: "Goa International Airport", city: "Goa", country: "India" },
  { code: "COK", name: "Cochin International Airport", city: "Kochi", country: "India" },
  { code: "TRV", name: "Trivandrum International Airport", city: "Thiruvananthapuram", country: "India" },
  { code: "JAI", name: "Jaipur International Airport", city: "Jaipur", country: "India" },
  { code: "LKO", name: "Chaudhary Charan Singh International Airport", city: "Lucknow", country: "India" },
  { code: "IXC", name: "Chandigarh International Airport", city: "Chandigarh", country: "India" },
  { code: "GAU", name: "Lokpriya Gopinath Bordoloi International Airport", city: "Guwahati", country: "India" },
  { code: "IXR", name: "Birsa Munda Airport", city: "Ranchi", country: "India" },
  { code: "BBI", name: "Biju Patnaik International Airport", city: "Bhubaneswar", country: "India" },
  { code: "NAG", name: "Dr. Babasaheb Ambedkar International Airport", city: "Nagpur", country: "India" },
  { code: "VNS", name: "Lal Bahadur Shastri Airport", city: "Varanasi", country: "India" },
  { code: "SXR", name: "Sheikh ul-Alam International Airport", city: "Srinagar", country: "India" },
  { code: "IXB", name: "Bagdogra Airport", city: "Bagdogra", country: "India" },
  { code: "ATQ", name: "Sri Guru Ram Dass Jee International Airport", city: "Amritsar", country: "India" },
  { code: "IDR", name: "Devi Ahilya Bai Holkar Airport", city: "Indore", country: "India" },
  { code: "IXZ", name: "Vir Savarkar International Airport", city: "Port Blair", country: "India" },
  { code: "UDR", name: "Maharana Pratap Airport", city: "Udaipur", country: "India" },
  { code: "DED", name: "Jolly Grant Airport", city: "Dehradun", country: "India" },
  { code: "VGA", name: "Vijayawada Airport", city: "Vijayawada", country: "India" },
  { code: "RPR", name: "Swami Vivekananda Airport", city: "Raipur", country: "India" },
  { code: "IXJ", name: "Satwari Airport", city: "Jammu", country: "India" },
  { code: "AGR", name: "Agra Airport", city: "Agra", country: "India" },
  { code: "PAT", name: "Lok Nayak Jayaprakash Airport", city: "Patna", country: "India" },
  { code: "BHO", name: "Raja Bhoj Airport", city: "Bhopal", country: "India" },
  { code: "IXM", name: "Madurai Airport", city: "Madurai", country: "India" },
  { code: "TRZ", name: "Tiruchirapalli International Airport", city: "Tiruchirappalli", country: "India" },
  { code: "CJB", name: "Coimbatore International Airport", city: "Coimbatore", country: "India" },
  { code: "IXE", name: "Mangalore International Airport", city: "Mangalore", country: "India" },
  { code: "HSR", name: "Rajkot International Airport", city: "Hirasar", country: "India" },
  
  // United States
  { code: "JFK", name: "John F. Kennedy International Airport", city: "New York", country: "USA" },
  { code: "LAX", name: "Los Angeles International Airport", city: "Los Angeles", country: "USA" },
  { code: "ORD", name: "O'Hare International Airport", city: "Chicago", country: "USA" },
  { code: "ATL", name: "Hartsfield-Jackson Atlanta International Airport", city: "Atlanta", country: "USA" },
  { code: "DFW", name: "Dallas/Fort Worth International Airport", city: "Dallas", country: "USA" },
  { code: "SFO", name: "San Francisco International Airport", city: "San Francisco", country: "USA" },
  { code: "LAS", name: "Harry Reid International Airport", city: "Las Vegas", country: "USA" },
  { code: "SEA", name: "Seattle-Tacoma International Airport", city: "Seattle", country: "USA" },
  { code: "MCO", name: "Orlando International Airport", city: "Orlando", country: "USA" },
  { code: "MIA", name: "Miami International Airport", city: "Miami", country: "USA" },
  { code: "BOS", name: "Logan International Airport", city: "Boston", country: "USA" },
  { code: "EWR", name: "Newark Liberty International Airport", city: "Newark", country: "USA" },
  { code: "IAH", name: "George Bush Intercontinental Airport", city: "Houston", country: "USA" },
  { code: "PHX", name: "Phoenix Sky Harbor International Airport", city: "Phoenix", country: "USA" },
  { code: "DEN", name: "Denver International Airport", city: "Denver", country: "USA" },
  
  // United Kingdom
  { code: "LHR", name: "London Heathrow Airport", city: "London", country: "UK" },
  { code: "LGW", name: "London Gatwick Airport", city: "London", country: "UK" },
  { code: "MAN", name: "Manchester Airport", city: "Manchester", country: "UK" },
  { code: "EDI", name: "Edinburgh Airport", city: "Edinburgh", country: "UK" },
  { code: "BHX", name: "Birmingham Airport", city: "Birmingham", country: "UK" },
  { code: "STN", name: "London Stansted Airport", city: "London", country: "UK" },
  
  // Europe
  { code: "CDG", name: "Charles de Gaulle Airport", city: "Paris", country: "France" },
  { code: "AMS", name: "Amsterdam Airport Schiphol", city: "Amsterdam", country: "Netherlands" },
  { code: "FRA", name: "Frankfurt Airport", city: "Frankfurt", country: "Germany" },
  { code: "MUC", name: "Munich Airport", city: "Munich", country: "Germany" },
  { code: "MAD", name: "Adolfo Suárez Madrid–Barajas Airport", city: "Madrid", country: "Spain" },
  { code: "BCN", name: "Barcelona–El Prat Airport", city: "Barcelona", country: "Spain" },
  { code: "FCO", name: "Leonardo da Vinci–Fiumicino Airport", city: "Rome", country: "Italy" },
  { code: "VCE", name: "Venice Marco Polo Airport", city: "Venice", country: "Italy" },
  { code: "MXP", name: "Milan Malpensa Airport", city: "Milan", country: "Italy" },
  { code: "ZRH", name: "Zurich Airport", city: "Zurich", country: "Switzerland" },
  { code: "VIE", name: "Vienna International Airport", city: "Vienna", country: "Austria" },
  { code: "CPH", name: "Copenhagen Airport", city: "Copenhagen", country: "Denmark" },
  { code: "ARN", name: "Stockholm Arlanda Airport", city: "Stockholm", country: "Sweden" },
  { code: "OSL", name: "Oslo Airport, Gardermoen", city: "Oslo", country: "Norway" },
  { code: "HEL", name: "Helsinki-Vantaa Airport", city: "Helsinki", country: "Finland" },
  { code: "DUB", name: "Dublin Airport", city: "Dublin", country: "Ireland" },
  { code: "BRU", name: "Brussels Airport", city: "Brussels", country: "Belgium" },
  { code: "LIS", name: "Lisbon Portela Airport", city: "Lisbon", country: "Portugal" },
  { code: "ATH", name: "Athens International Airport", city: "Athens", country: "Greece" },
  { code: "IST", name: "Istanbul Airport", city: "Istanbul", country: "Turkey" },
  { code: "SAW", name: "Sabiha Gökçen International Airport", city: "Istanbul", country: "Turkey" },
  { code: "PRG", name: "Václav Havel Airport Prague", city: "Prague", country: "Czech Republic" },
  { code: "WAW", name: "Warsaw Chopin Airport", city: "Warsaw", country: "Poland" },
  
  // Middle East
  { code: "DXB", name: "Dubai International Airport", city: "Dubai", country: "UAE" },
  { code: "AUH", name: "Abu Dhabi International Airport", city: "Abu Dhabi", country: "UAE" },
  { code: "DOH", name: "Hamad International Airport", city: "Doha", country: "Qatar" },
  { code: "RUH", name: "King Khalid International Airport", city: "Riyadh", country: "Saudi Arabia" },
  { code: "JED", name: "King Abdulaziz International Airport", city: "Jeddah", country: "Saudi Arabia" },
  { code: "KWI", name: "Kuwait International Airport", city: "Kuwait City", country: "Kuwait" },
  { code: "BAH", name: "Bahrain International Airport", city: "Manama", country: "Bahrain" },
  { code: "MCT", name: "Muscat International Airport", city: "Muscat", country: "Oman" },
  { code: "AMM", name: "Queen Alia International Airport", city: "Amman", country: "Jordan" },
  { code: "CAI", name: "Cairo International Airport", city: "Cairo", country: "Egypt" },
  { code: "TLV", name: "Ben Gurion Airport", city: "Tel Aviv", country: "Israel" },
  
  // Southeast Asia
  { code: "SIN", name: "Singapore Changi Airport", city: "Singapore", country: "Singapore" },
  { code: "BKK", name: "Suvarnabhumi Airport", city: "Bangkok", country: "Thailand" },
  { code: "DMK", name: "Don Mueang International Airport", city: "Bangkok", country: "Thailand" },
  { code: "KUL", name: "Kuala Lumpur International Airport", city: "Kuala Lumpur", country: "Malaysia" },
  { code: "CGK", name: "Soekarno–Hatta International Airport", city: "Jakarta", country: "Indonesia" },
  { code: "DPS", name: "Ngurah Rai International Airport", city: "Denpasar (Bali)", country: "Indonesia" },
  { code: "MNL", name: "Ninoy Aquino International Airport", city: "Manila", country: "Philippines" },
  { code: "HAN", name: "Noi Bai International Airport", city: "Hanoi", country: "Vietnam" },
  { code: "SGN", name: "Tan Son Nhat International Airport", city: "Ho Chi Minh City", country: "Vietnam" },
  { code: "RGN", name: "Yangon International Airport", city: "Yangon", country: "Myanmar" },
  { code: "PNH", name: "Phnom Penh International Airport", city: "Phnom Penh", country: "Cambodia" },
  
  // East Asia
  { code: "HKG", name: "Hong Kong International Airport", city: "Hong Kong", country: "Hong Kong" },
  { code: "NRT", name: "Narita International Airport", city: "Tokyo", country: "Japan" },
  { code: "HND", name: "Tokyo Haneda Airport", city: "Tokyo", country: "Japan" },
  { code: "KIX", name: "Kansai International Airport", city: "Osaka", country: "Japan" },
  { code: "ICN", name: "Incheon International Airport", city: "Seoul", country: "South Korea" },
  { code: "GMP", name: "Gimpo International Airport", city: "Seoul", country: "South Korea" },
  { code: "PEK", name: "Beijing Capital International Airport", city: "Beijing", country: "China" },
  { code: "PVG", name: "Shanghai Pudong International Airport", city: "Shanghai", country: "China" },
  { code: "CAN", name: "Guangzhou Baiyun International Airport", city: "Guangzhou", country: "China" },
  { code: "TPE", name: "Taiwan Taoyuan International Airport", city: "Taipei", country: "Taiwan" },
  
  // Oceania
  { code: "SYD", name: "Sydney Kingsford Smith Airport", city: "Sydney", country: "Australia" },
  { code: "MEL", name: "Melbourne Airport", city: "Melbourne", country: "Australia" },
  { code: "BNE", name: "Brisbane Airport", city: "Brisbane", country: "Australia" },
  { code: "PER", name: "Perth Airport", city: "Perth", country: "Australia" },
  { code: "AKL", name: "Auckland Airport", city: "Auckland", country: "New Zealand" },
  { code: "CHC", name: "Christchurch International Airport", city: "Christchurch", country: "New Zealand" },
  
  // South America
  { code: "GRU", name: "São Paulo/Guarulhos International Airport", city: "São Paulo", country: "Brazil" },
  { code: "GIG", name: "Rio de Janeiro/Galeão International Airport", city: "Rio de Janeiro", country: "Brazil" },
  { code: "BSB", name: "Brasília International Airport", city: "Brasília", country: "Brazil" },
  { code: "EZE", name: "Ministro Pistarini International Airport", city: "Buenos Aires", country: "Argentina" },
  { code: "SCL", name: "Arturo Merino Benítez International Airport", city: "Santiago", country: "Chile" },
  { code: "BOG", name: "El Dorado International Airport", city: "Bogotá", country: "Colombia" },
  { code: "LIM", name: "Jorge Chávez International Airport", city: "Lima", country: "Peru" },
  
  // Africa
  { code: "CPT", name: "Cape Town International Airport", city: "Cape Town", country: "South Africa" },
  { code: "JNB", name: "O. R. Tambo International Airport", city: "Johannesburg", country: "South Africa" },
  { code: "NBO", name: "Jomo Kenyatta International Airport", city: "Nairobi", country: "Kenya" },
  { code: "ADD", name: "Addis Ababa Bole International Airport", city: "Addis Ababa", country: "Ethiopia" },
  { code: "LOS", name: "Murtala Muhammed International Airport", city: "Lagos", country: "Nigeria" },
  { code: "CAS", name: "Mohammed V International Airport", city: "Casablanca", country: "Morocco" },
  
  // Canada
  { code: "YYZ", name: "Toronto Pearson International Airport", city: "Toronto", country: "Canada" },
  { code: "YVR", name: "Vancouver International Airport", city: "Vancouver", country: "Canada" },
  { code: "YUL", name: "Montréal-Pierre Elliott Trudeau International Airport", city: "Montreal", country: "Canada" },
  { code: "YYC", name: "Calgary International Airport", city: "Calgary", country: "Canada" },
];

export const searchAirports = (query: string): Airport[] => {
  if (!query || query.length < 2) return [];
  
  const searchTerm = query.toLowerCase();
  
  return airports.filter(airport => 
    airport.code.toLowerCase().includes(searchTerm) ||
    airport.name.toLowerCase().includes(searchTerm) ||
    airport.city.toLowerCase().includes(searchTerm) ||
    airport.country.toLowerCase().includes(searchTerm)
  ).slice(0, 10); // Limit to 10 results
};
