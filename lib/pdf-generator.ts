import jsPDF from "jspdf";

interface RTIData {
    applicantName: string;
    address: string;
    place: string;
    phone?: string;
    district: string;
    localBodyType: string;
    localBodyName: string;
    subject: string;
    questions: string[];
    declarationDate: string;
    declarationPlace: string;
    signature: string;
}

export const generateRTI = async (data: RTIData) => {
    const doc = new jsPDF();
    const margin = 20;
    let cursorY = 20;

    // Header
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("FORM A", 105, cursorY, { align: "center" });
    cursorY += 10;

    doc.setFontSize(12);
    doc.text("Application for Information under Section 6(1) of the RTI Act, 2005", 105, cursorY, { align: "center" });
    cursorY += 15;

    // To section
    doc.setFont("helvetica", "bold");
    doc.text("To,", margin, cursorY);
    cursorY += 7;
    doc.setFont("helvetica", "normal");
    doc.text("The State Public Information Officer,", margin, cursorY);
    cursorY += 6;
    doc.text(`${data.localBodyName}, ${data.localBodyType},`, margin, cursorY);
    cursorY += 6;
    doc.text(`${data.district} District, Kerala.`, margin, cursorY);
    cursorY += 15;

    // Applicant section
    doc.setFont("helvetica", "bold");
    doc.text("1. Name of the Applicant:", margin, cursorY);
    doc.setFont("helvetica", "normal");
    doc.text(data.applicantName, margin + 55, cursorY);
    cursorY += 10;

    doc.setFont("helvetica", "bold");
    doc.text("2. Address:", margin, cursorY);
    doc.setFont("helvetica", "normal");
    const splitAddress = doc.splitTextToSize(data.address, 120);
    doc.text(splitAddress, margin + 55, cursorY);
    cursorY += (splitAddress.length * 6) + 4;

    // Subject
    doc.setFont("helvetica", "bold");
    doc.text("3. Particulars of Information Required:", margin, cursorY);
    cursorY += 10;

    doc.text("(i) Subject Matter:", margin + 5, cursorY);
    doc.setFont("helvetica", "normal");
    const splitSubject = doc.splitTextToSize(data.subject, 130);
    doc.text(splitSubject, margin + 45, cursorY);
    cursorY += (splitSubject.length * 6) + 4;

    doc.setFont("helvetica", "bold");
    doc.text("(ii) Specific Questions:", margin + 5, cursorY);
    cursorY += 8;
    doc.setFont("helvetica", "normal");
    data.questions.forEach((q, i) => {
        const splitQ = doc.splitTextToSize(`${i + 1}. ${q}`, 150);
        doc.text(splitQ, margin + 10, cursorY);
        cursorY += (splitQ.length * 6) + 2;
    });

    cursorY += 10;

    // Fee info
    doc.setFont("helvetica", "bold");
    doc.text("4. Application Fee Details:", margin, cursorY);
    cursorY += 7;
    doc.setFont("helvetica", "normal");
    doc.text("Enclosed an amount of Rs. 10/- by way of cash/court fee stamp/DD/Chalan.", margin + 5, cursorY);
    cursorY += 15;

    // Declaration
    doc.setFont("helvetica", "italic");
    doc.setFontSize(10);
    const declaration = "I state that the information sought does not fall within the restrictions contained in Section 8 and 9 of the RTI Act and to the best of my knowledge it pertains to your office.";
    const splitDec = doc.splitTextToSize(declaration, 170);
    doc.text(splitDec, margin, cursorY);
    cursorY += 20;

    // Footer / Signature
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Place: ${data.declarationPlace}`, margin, cursorY);
    doc.text("Yours faithfully,", 140, cursorY);
    cursorY += 7;
    doc.text(`Date: ${data.declarationDate}`, margin, cursorY);

    if (data.signature) {
        try {
            doc.addImage(data.signature, "PNG", 140, cursorY, 40, 20);
        } catch (e) {
            console.error("Error adding signature to PDF", e);
        }
    }
    cursorY += 25;
    doc.text(`(${data.applicantName})`, 140, cursorY);

    // Save the PDF
    doc.save(`RTI_Application_${data.applicantName.replace(/\s+/g, "_")}.pdf`);
};
