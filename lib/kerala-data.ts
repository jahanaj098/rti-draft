/**
 * Static data for Kerala Districts and Local Bodies
 */

export const DISTRICTS = [
    "Alappuzha", "Ernakulam", "Idukki", "Kannur", "Kasaragod",
    "Kollam", "Kottayam", "Kozhikode", "Malappuram", "Palakkad",
    "Pathanamthitta", "Thiruvananthapuram", "Thrissur", "Wayanad"
];

export const LOCAL_BODY_TYPES = [
    "District Panchayat",
    "Block Panchayat",
    "Grama Panchayat",
    "Municipality",
    "Municipal Corporation"
];

// Mock data for local bodies - in a real app, this would be a larger JSON or API
export const LOCAL_BODIES_MOCK: Record<string, string[]> = {
    "Thiruvananthapuram-Municipal Corporation": ["Thiruvananthapuram Corporation"],
    "Thiruvananthapuram-Municipality": ["Neyyattinkara", "Attingal", "Nedumangad", "Varkala"],
    "Ernakulam-Municipal Corporation": ["Kochi Corporation"],
    "Ernakulam-Municipality": ["Aluva", "Angamaly", "Eloor", "Kalamassery", "Kothamangalam", "Maradu", "Muvattupuzha", "North Paravur", "Perumbavoor", "Thrikkakara", "Thrippunithura"],
    "Kozhikode-Municipal Corporation": ["Kozhikode Corporation"],
    "Kozhikode-Municipality": ["Feroke", "Koduvally", "Koyilandy", "Mukkam", "Payyoli", "Ramanattukara", "Vatakara"],
};
