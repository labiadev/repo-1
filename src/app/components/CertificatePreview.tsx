'use client';
/* eslint-disable @typescript-eslint/no-unused-vars */

import React, { useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { QRCodeSVG } from 'qrcode.react';
import { Download, FileText, CheckCircle2, RefreshCw } from 'lucide-react';
import { StarWarsCharacter, generateCertificateMarkdown } from '../utils/markdownTemplate';

interface CertificatePreviewProps {
  character: StarWarsCharacter;
}

export default function CertificatePreview({ character }: CertificatePreviewProps) {
  const certificateRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const [timestamp] = useState(() => {
    const d = new Date();
    return d.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).toUpperCase() + ' ' + d.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  });

  const hash = React.useMemo(() => {
    let value = 0;
    const key = `${character.name}-${character.birth_year}-${timestamp}`;
    for (let i = 0; i < key.length; i++) {
      value = (value << 5) - value + key.charCodeAt(i);
      value |= 0;
    }
    const hex = Math.abs(value).toString(16).padStart(8, '0');
    return `9F4C${hex}B204DA51CF94D80A13`.substring(0, 24).toUpperCase();
  }, [character, timestamp]);

  const markdownContent = generateCertificateMarkdown(character);
  const validationUrl = `https://starwars.esign.company/?name=${encodeURIComponent(character.name)}`;

  const handleDownloadPDF = async () => {
    if (!certificateRef.current) return;
    setDownloading(true);
    setDownloadSuccess(false);

    try {
      // Dynamic imports to prevent SSR errors
      const html2canvasModule = await import('html2canvas-pro');
      const html2canvas = html2canvasModule.default || html2canvasModule;
      const { jsPDF } = await import('jspdf');
      
      const element = certificateRef.current;
      
      // Render the HTML element to a canvas using html2canvas-pro (which supports oklch)
      const canvas = await html2canvas(element, {
        scale: 2.5,
        useCORS: true,
        logging: false,
        backgroundColor: '#FFFFFF',
        windowWidth: 800,
        onclone: (clonedDoc) => {
          const clonedElement = clonedDoc.querySelector('[data-certificate]') as HTMLElement;
          if (clonedElement) {
            clonedElement.style.width = '800px';
            clonedElement.style.minWidth = '800px';
            clonedElement.style.maxWidth = '800px';
            clonedElement.style.minHeight = '1130px';
            clonedElement.style.height = '1130px';
            clonedElement.style.padding = '64px';
          }
        }
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.98);
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      // A4 page dimensions (210mm x 297mm)
      pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297);
      pdf.save(`Certificado_${character.name.replace(/\s+/g, '_')}.pdf`);
      
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Hubo un error al generar el PDF. Por favor inténtalo de nuevo.');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-12 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Action Bar */}
      <div className="flex justify-between items-center bg-white border border-slate-200 px-6 py-4 rounded-xl shadow-md">
        <div className="flex items-center gap-2 text-indigo-700 font-semibold">
          <FileText className="w-5 h-5" />
          <span>Vista Previa del Certificado</span>
        </div>
        
        <button
          onClick={handleDownloadPDF}
          disabled={downloading}
          className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg transition-all duration-300 shadow-md hover:scale-[1.02] active:scale-95 disabled:opacity-50"
        >
          {downloading ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin" />
              <span>Generando PDF...</span>
            </>
          ) : downloadSuccess ? (
            <>
              <CheckCircle2 className="w-5 h-5 text-indigo-100" />
              <span>¡Descargado!</span>
            </>
          ) : (
            <>
              <Download className="w-5 h-5" />
              <span>Descargar PDF</span>
            </>
          )}
        </button>
      </div>

      {/* Printable Certificate Page */}
      <div className="w-full rounded-2xl shadow-xl border border-slate-200 bg-white overflow-hidden">
        <div 
          ref={certificateRef}
          data-certificate
          className="relative w-full bg-white text-slate-800 p-6 sm:p-12 md:p-16 flex flex-col justify-between leading-relaxed box-border transition-all duration-300"
          style={{ minHeight: '600px', maxWidth: '800px', margin: '0 auto' }}
        >
          {/* Elegant Outer Border */}
          <div className="absolute inset-4 border-2 border-double border-indigo-600/10 rounded-xl pointer-events-none" />
          {/* Elegant Inner Accent Corners */}
          <div className="absolute top-6 left-6 w-8 h-8 border-t-2 border-l-2 border-indigo-600/30 pointer-events-none" />
          <div className="absolute top-6 right-6 w-8 h-8 border-t-2 border-r-2 border-indigo-600/30 pointer-events-none" />
          <div className="absolute bottom-6 left-6 w-8 h-8 border-b-2 border-l-2 border-indigo-600/30 pointer-events-none" />
          <div className="absolute bottom-6 right-6 w-8 h-8 border-b-2 border-r-2 border-indigo-600/30 pointer-events-none" />

          {/* Certificate Content */}
          <div className="space-y-8 relative z-10">
            {/* Header Emblem / Art */}
            <div className="text-center space-y-2 pb-6 border-b border-slate-100">
              <div className="inline-block px-3 py-1 bg-indigo-50 border border-indigo-100 rounded-full text-xs font-semibold text-indigo-700 uppercase tracking-widest mb-2">
                Documento de Identificación de la Holonet
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 via-indigo-900 to-indigo-700 uppercase font-sans">
                Archivos Galácticos
              </h1>
              <p className="text-xs text-slate-400 font-mono tracking-widest">HOLONET SECURE PROTOCOL // CLASIFICADO</p>
            </div>

            {/* Markdown Rendered Area */}
            <div className="prose prose-slate max-w-none text-slate-700 font-sans space-y-6">
              <ReactMarkdown
                components={{
                  h1: ({ node, ...props }) => <h2 className="text-xl font-bold text-indigo-900 uppercase tracking-wide border-b border-slate-100 pb-2" {...props} />,
                  h2: ({ node, ...props }) => <h3 className="text-lg font-semibold text-indigo-700 tracking-normal" {...props} />,
                  h3: ({ node, ...props }) => <h4 className="text-md font-medium text-slate-600 uppercase tracking-wider" {...props} />,
                  p: ({ node, ...props }) => <p className="text-sm text-slate-600" {...props} />,
                  ul: ({ node, ...props }) => <ul className="list-disc pl-5 space-y-2 text-sm text-slate-600" {...props} />,
                  li: ({ node, ...props }) => <li className="marker:text-indigo-500" {...props} />,
                  hr: ({ node, ...props }) => <hr className="border-t border-slate-100 my-4" {...props} />,
                  strong: ({ node, ...props }) => <strong className="text-indigo-950 font-bold" {...props} />,
                }}
              >
                {markdownContent}
              </ReactMarkdown>
            </div>
          </div>

          {/* Footer Validation Area (QR and Signature) */}
          <div className="mt-12 pt-8 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
            {/* Signature / Authority Seal */}
            <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-2">
              <div className="h-10 flex items-center justify-center">
                <span className="font-mono text-[10px] text-slate-400">SECURE DIGITAL SIGNATURE by ESIGN</span>
              </div>
              <div className="w-40 border-t border-slate-200 pt-1">
                <p className="text-xs text-slate-800 font-semibold">Oficial de Archivo Jedi</p>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider">Cámara del Templo Coruscant</p>
              </div>
            </div>

            {/* Cryptographic Timestamping Seal */}
            <div className="flex flex-col items-center text-center space-y-1 bg-slate-50/50 px-4 py-3 rounded-lg border border-slate-100 max-w-xs">
              <span className="text-[8px] font-bold text-slate-400 tracking-widest uppercase font-mono">ESIGN TSA // TIMESTAMPING SECURE</span>
              <span className="text-xs font-semibold text-indigo-950 font-mono">{timestamp}</span>
              <span className="text-[8px] text-slate-400 font-mono max-w-[190px] truncate">
                HASH: {hash}
              </span>
              <span className="text-[8px] text-indigo-600 font-bold uppercase tracking-wide">
                AUTORIDAD DE SELLADO ESIGN
              </span>
            </div>

            {/* Dynamic QR Code Block */}
            <div className="flex items-center gap-4 bg-slate-50 p-4 border border-slate-100 rounded-xl">
              <div className="flex flex-col text-right justify-center">
                <span className="text-xs font-semibold text-slate-800">Verificación QR</span>
                <span className="text-[9px] text-slate-500 font-mono max-w-[150px] overflow-hidden text-ellipsis whitespace-nowrap">
                  ID: {character.name.toUpperCase().substring(0, 12)}
                </span>
                <span className="text-[8px] text-indigo-600 font-medium mt-1 break-all max-w-[150px] leading-tight">
                  starwars.esign.company
                </span>
              </div>
              <div className="bg-white p-2 rounded-lg shrink-0 border border-slate-100">
                <QRCodeSVG
                  value={validationUrl}
                  size={76}
                  level="M"
                  bgColor="#FFFFFF"
                  fgColor="#000000"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
