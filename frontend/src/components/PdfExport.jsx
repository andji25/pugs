import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

function PdfExport({ trip, destinations, activities, expenses, checklist }) {
    const handleExport = () => {
        const doc = new jsPDF()

        doc.setFillColor(41, 128, 185)
        doc.rect(0, 0, 210, 30, 'F')
        doc.setTextColor(255, 255, 255)
        doc.setFontSize(20)
        doc.text(trip.name, 14, 20)

        doc.setTextColor(0, 0, 0)
        doc.setFontSize(11)
        let y = 40
        doc.text(`Period: ${new Date(trip.startDate).toLocaleDateString()} - ${new Date(trip.endDate).toLocaleDateString()}`, 14, y); y += 7
        if (trip.description) { 
            doc.text(`Description: ${trip.description}`, 14, y)
            y += 7 
        }
        if (trip.notes) { 
            doc.text(`Notes: ${trip.notes}`, 14, y)
            y += 7
        }

        autoTable(doc, {
            startY: y + 5,
            head: [['Budget', 'Total Spent', 'Remaining']],
            body: [[`${trip.budget}€`, `${trip.totalExpenses}€`, `${trip.remainingBudget}€`]],
            headStyles: { fillColor: [41, 128, 185] }
        })

        if (destinations.length > 0) {
            autoTable(doc, {
                startY: doc.lastAutoTable.finalY + 10,
                head: [['Destinations', 'Location', 'Arrival', 'Departure']],
                body: destinations.map(d => [
                    d.name,
                    d.location,
                    new Date(d.arrivalDate).toLocaleDateString(),
                    new Date(d.departureDate).toLocaleDateString()
                ]),
                headStyles: { fillColor: [39, 174, 96] }
            })
        }

        if (activities.length > 0) {
            autoTable(doc, {
                startY: doc.lastAutoTable.finalY + 10,
                head: [['Activity', 'Date', 'Time', 'Location', 'Cost']],
                body: activities.map(a => [
                    a.name,
                    new Date(a.date).toLocaleDateString(),
                    a.time || '-',
                    a.location || '-',
                    `${a.estimatedCost}€`
                ]),
                headStyles: { fillColor: [142, 68, 173] }
            })
        }

        if (expenses.length > 0) {
            autoTable(doc, {
                startY: doc.lastAutoTable.finalY + 10,
                head: [['Expense', 'Category', 'Amount', 'Date']],
                body: expenses.map(e => [
                    e.name,
                    e.category,
                    `${e.amount}€`,
                    new Date(e.date).toLocaleDateString()
                ]),
                headStyles: { fillColor: [231, 76, 60] }
            })
        }

        if (checklist.length > 0) {
            autoTable(doc, {
                startY: doc.lastAutoTable.finalY + 10,
                head: [['Item', 'Status']],
                body: checklist.map(c => [c.name, c.isCompleted ? '✓ Done' : '○ Pending']),
                headStyles: { fillColor: [52, 73, 94] }
            })
        }

        doc.save(`${trip.name}-plan.pdf`)
    }

    return (
        <button onClick={handleExport}>📄 Export PDF</button>
    )
}

export default PdfExport