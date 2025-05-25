"use client";
import { useState } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function ResumeForm() {
    const [output, setOutput] = useState<{ summary: string; bullets: string[] } | null>(null);

    const [form, setForm] = useState({
        fullName: '',
        jobTitle: '',
        summary: '',
        experience: '',
        education: '',
        skills: '',
    });

    // const handleDownloadPDF = () => {
    //     if (!output) return;

    //     const element = document.getElementById('resume-content');
    //     if (!element) return;

    //     import('html2pdf.js').then((html2pdf) => {
    //         html2pdf()
    //             .set({
    //                 margin: 0.5,
    //                 filename: `${form.fullName.replace(/\s+/g, '_')}_Resume.pdf`,
    //                 html2canvas: { scale: 2 },
    //                 jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
    //             })
    //             .from(element)
    //             .save();
    //     });
    // };

    const handleDownloadPDF = async () => {
        if (!output) return;
      
        const element = document.getElementById('resume-content');
        if (!element) return;
      
        const canvas = await html2canvas(element, { scale: 2 });
      
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'px',
          format: 'a4',
        });
      
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`${form.fullName.replace(/\s+/g, '_') || 'resume'}.pdf`);
      };
      

    const handleGenerate = async () => {
        const res = await fetch('/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form),
        });

        const data = await res.json();
        const content: string = data.result;

        const [summaryLine, ...experienceLines] = content
            .split('\n')
            .map((line) => line.trim())
            .filter((line) => line);

        setOutput({
            summary: summaryLine.replace(/^Summary:?\s*/i, ''),
            bullets: experienceLines.map((line) => line.replace(/^[-•]\s*/, '')),
        });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    return (
        <div className="bg-white px-8 py-10 shadow-md rounded-lg max-w-3xl mx-auto mt-12">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">AI Resume Builder</h2>

            <div className="space-y-6">
                {[
                    { label: 'Full Name', name: 'fullName' },
                    { label: 'Job Title', name: 'jobTitle' },
                    { label: 'Professional Summary', name: 'summary', textarea: true },
                    { label: 'Work Experience', name: 'experience', textarea: true },
                    { label: 'Education', name: 'education', textarea: true },
                    { label: 'Skills', name: 'skills', textarea: true },
                ].map(({ label, name, textarea }) => (
                    <div key={name}>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                        {textarea ? (
                            <textarea
                                name={name}
                                rows={3}
                                value={(form as any)[name]}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            />
                        ) : (
                            <input
                                type="text"
                                name={name}
                                value={(form as any)[name]}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            />
                        )}
                    </div>
                ))}
            </div>

            <div className="mt-8">
                <button
                    type="button"
                    className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                    onClick={handleGenerate}
                >
                    Generate Resume
                </button>
            </div>

            {output && (
                <>
                    <div id="resume-content" className="mt-10 bg-gray-50 p-6 rounded-md shadow-inner">
                        <h3 className="text-lg font-semibold mb-2">AI-Generated Summary</h3>
                        <p className="mb-4 text-gray-800">{output.summary}</p>

                        <h3 className="text-lg font-semibold mb-2">Work Experience</h3>
                        <ul className="list-disc pl-6 space-y-2 text-gray-700">
                            {output.bullets.map((item, i) => (
                                <li key={i}>{item}</li>
                            ))}
                        </ul>
                    </div>

                    <button
                        onClick={handleDownloadPDF}
                        className="mt-6 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                        Download as PDF
                    </button>
                </>

            )}
        </div>
    );
}
