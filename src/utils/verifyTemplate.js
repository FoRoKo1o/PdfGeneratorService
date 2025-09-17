import axios from "axios";

export async function verifyTemplate(template) {
    try {
        const response = await axios.get("http://localhost:3000/templates"); 
        const availableTemplates = response.data.templates;
        if (availableTemplates.includes(template)) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.error("Error verifying template:", error);
        return false;
    }
}