import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

/**
 * تحليل مقاسات التقرير لتحديد التوجه الأمثل
 */
const analyzeReportDimensions = (headers: string[], data: any[][]) => {
  const numColumns = headers.length;
  const avgColumnWidth = headers.reduce((sum, header) => sum + header.length, 0) / numColumns;
  const maxDataWidth = data.reduce((max, row) => {
    const rowWidth = row.reduce((sum, cell) => sum + String(cell || '').length, 0) / row.length;
    return Math.max(max, rowWidth);
  }, 0);
  
  const estimatedWidth = numColumns * Math.max(avgColumnWidth, maxDataWidth) * 8; // تقدير بالبكسل
  
  return {
    numColumns,
    avgColumnWidth,
    maxDataWidth,
    estimatedWidth,
    recommendLandscape: numColumns > 6 || estimatedWidth > 1000
  };
};

/**
 * تصدير إلى PDF بشكل احترافي مع دعم كامل للعربية وتوجه ذكي
 * يحدد تلقائياً التوجه الأمثل (Portrait/Landscape) حسب محتوى التقرير
 */
export const exportToPDF = async (
  title: string, 
  headers: string[], 
  data: any[][], 
  filename: string = 'report.pdf'
): Promise<boolean> => {
  try {
    // تحليل مقاسات التقرير
    const dimensions = analyzeReportDimensions(headers, data);
    const isLandscape = dimensions.recommendLandscape;
    
    console.log('📊 تحليل التقرير:', {
      عدد_الأعمدة: dimensions.numColumns,
      العرض_المقدر: dimensions.estimatedWidth,
      التوجه_المقترح: isLandscape ? 'أفقي (Landscape)' : 'عمودي (Portrait)'
    });

    // تحديد مقاسات الحاوية حسب التوجه
    const containerWidth = isLandscape ? 1200 : 800;
    const padding = isLandscape ? 30 : 40;
    
    // إنشاء عنصر HTML مؤقت للتقرير
    const reportContainer = document.createElement('div');
    reportContainer.style.cssText = `
      position: absolute;
      left: -9999px;
      top: -9999px;
      width: ${containerWidth}px;
      background: white;
      padding: ${padding}px;
      font-family: 'Cairo', 'Segoe UI', Tahoma, sans-serif;
      direction: rtl;
    `;
    
    // تحديد حجم الخط وpadding حسب عدد الأعمدة
    const fontSize = isLandscape ? (dimensions.numColumns > 10 ? 11 : 13) : 14;
    const cellPadding = isLandscape ? (dimensions.numColumns > 10 ? '8px 6px' : '10px 8px') : '12px 10px';
    const headerFontSize = isLandscape ? 24 : 28;
    
    // بناء HTML للتقرير مع تنسيق متجاوب
    reportContainer.innerHTML = `
      <div style="text-align: center; margin-bottom: ${isLandscape ? '20px' : '30px'};">
        <h1 style="color: #2C3E50; font-size: ${headerFontSize}px; font-weight: bold; margin: 0 0 10px 0;">
          ${title}
        </h1>
        <p style="color: #7F8C8D; font-size: ${fontSize - 2}px; margin: 0;">
          تاريخ التقرير: ${new Date().toLocaleDateString('ar-EG', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })} | التوجه: ${isLandscape ? 'أفقي' : 'عمودي'} | الأعمدة: ${dimensions.numColumns}
        </p>
      </div>
      
      <table style="width: 100%; border-collapse: collapse; box-shadow: 0 2px 8px rgba(0,0,0,0.1); font-size: ${fontSize}px;">
        <thead>
          <tr style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white;">
            ${headers.map(h => `
              <th style="
                padding: ${cellPadding};
                text-align: center;
                font-size: ${fontSize + 1}px;
                font-weight: bold;
                border: 1px solid #ddd;
                word-wrap: break-word;
                max-width: ${isLandscape ? Math.floor(containerWidth / dimensions.numColumns) : 'auto'}px;
              ">${h}</th>
            `).join('')}
          </tr>
        </thead>
        <tbody>
          ${data.map((row, i) => `
            <tr style="background-color: ${i % 2 === 0 ? '#f8f9fa' : 'white'};">
              ${row.map(cell => `
                <td style="
                  padding: ${cellPadding};
                  text-align: center;
                  border: 1px solid #ddd;
                  color: #2C3E50;
                  word-wrap: break-word;
                  max-width: ${isLandscape ? Math.floor(containerWidth / dimensions.numColumns) : 'auto'}px;
                ">${cell}</td>
              `).join('')}
            </tr>
          `).join('')}
        </tbody>
      </table>
      
      <div style="margin-top: ${isLandscape ? '20px' : '30px'}; text-align: center; color: #95a5a6; font-size: ${fontSize - 2}px;">
        <p>تم إنشاء هذا التقرير بواسطة نظام FarmDream ERP • ${dimensions.numColumns} عمود • ${data.length} سجل</p>
      </div>
    `;
    
    document.body.appendChild(reportContainer);
    
    // تحويل HTML إلى صورة مع إعدادات محسّنة
    const canvas = await html2canvas(reportContainer, {
      scale: isLandscape ? 1.5 : 2, // تقليل الدقة للتقارير الكبيرة
      backgroundColor: '#ffffff',
      logging: false,
      useCORS: true,
      width: containerWidth + (padding * 2),
      height: reportContainer.scrollHeight
    });
    
    // إزالة العنصر المؤقت
    document.body.removeChild(reportContainer);
    
    // تحديد مقاسات PDF حسب التوجه
    const orientation = isLandscape ? 'landscape' : 'portrait';
    const pageWidth = isLandscape ? 297 : 210; // A4 في mm
    const pageHeight = isLandscape ? 210 : 297; // A4 في mm
    
    // إنشاء PDF مع التوجه المناسب
    const pdf = new jsPDF({
      orientation: orientation,
      unit: 'mm',
      format: 'a4'
    });
    
    const imgData = canvas.toDataURL('image/png');
    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    let heightLeft = imgHeight;
    let position = 0;
    
    console.log('📄 إعدادات PDF:', {
      التوجه: orientation,
      عرض_الصفحة: pageWidth + 'mm',
      ارتفاع_الصفحة: pageHeight + 'mm',
      عرض_الصورة: imgWidth + 'mm',
      ارتفاع_الصورة: imgHeight.toFixed(1) + 'mm'
    });
    
    // إضافة الصفحة الأولى
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
    
    // إضافة صفحات إضافية إذا لزم الأمر
    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage(undefined, orientation);
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }
    
    // حفظ الملف
    pdf.save(filename);
    return true;
    
  } catch (error) {
    console.error('Error exporting to PDF:', error);
    return false;
  }
}

// تصدير إلى Excel
export const exportToExcel = (title: string, headers: string[], data: any[][], filename: string = 'report.xlsx') => {
  try {
    // إنشاء workbook جديد
    const wb = XLSX.utils.book_new();
    
    // تحضير البيانات مع الرؤوس
    const wsData = [headers, ...data];
    
    // إنشاء worksheet
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    
    // تنسيق العرض التلقائي للأعمدة
    const maxWidth = headers.map((header, i) => {
      const headerLength = header.length;
      const dataLengths = data.map(row => String(row[i] || '').length);
      return Math.max(headerLength, ...dataLengths, 10);
    });
    
    ws['!cols'] = maxWidth.map(w => ({ wch: w + 2 }));
    
    // إضافة worksheet للـ workbook
    XLSX.utils.book_append_sheet(wb, ws, title);
    
    // حفظ الملف
    XLSX.writeFile(wb, filename);
    return true;
  } catch (error) {
    console.error('Error exporting to Excel:', error);
    return false;
  }
};

// تصدير إلى CSV
export const exportToCSV = (headers: string[], data: any[][], filename: string = 'report.csv') => {
  try {
    // إنشاء workbook
    const wb = XLSX.utils.book_new();
    
    // تحضير البيانات
    const wsData = [headers, ...data];
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    
    // إضافة worksheet
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    
    // حفظ كـ CSV
    XLSX.writeFile(wb, filename, { bookType: 'csv' });
    return true;
  } catch (error) {
    console.error('Error exporting to CSV:', error);
    return false;
  }
};

// طباعة التقرير
export const printReport = () => {
  window.print();
};

// دالة مساعدة لتنسيق التاريخ
export const formatDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('ar-EG');
};

// دالة مساعدة لتنسيق الأرقام
export const formatNumber = (num: number, decimals: number = 2): string => {
  return num.toLocaleString('ar-EG', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
};

// دالة مساعدة لتنسيق العملة
export const formatCurrency = (amount: number): string => {
  return `${formatNumber(amount)} ج.م`;
};

/**
 * معاينة توجه التقرير قبل التصدير
 */
export const previewReportOrientation = (headers: string[], data: any[][]) => {
  const dimensions = analyzeReportDimensions(headers, data);
  return {
    numColumns: dimensions.numColumns,
    estimatedWidth: dimensions.estimatedWidth,
    recommendedOrientation: dimensions.recommendLandscape ? 'landscape' : 'portrait',
    orientationReason: dimensions.recommendLandscape 
      ? `عدد الأعمدة كبير (${dimensions.numColumns}) أو العرض المقدر كبير (${dimensions.estimatedWidth}px)`
      : `عدد الأعمدة مناسب (${dimensions.numColumns}) والعرض المقدر مقبول (${dimensions.estimatedWidth}px)`,
    tips: dimensions.recommendLandscape 
      ? ['سيتم استخدام التوجه الأفقي لعرض أفضل', 'حجم الخط سيتم تقليله قليلاً للوضوح'] 
      : ['سيتم استخدام التوجه العمودي العادي', 'حجم الخط والتباعد مثالي']
  };
};

/**
 * تصدير محسّن للتقارير الكبيرة مع تقسيم ذكي
 */
export const exportLargeReportToPDF = async (
  title: string,
  headers: string[],
  data: any[][],
  filename: string = 'large-report.pdf',
  maxRowsPerPage: number = 50
): Promise<boolean> => {
  try {
    if (data.length <= maxRowsPerPage) {
      // التقرير صغير، استخدم الطريقة العادية
      return await exportToPDF(title, headers, data, filename);
    }

    // تقسيم البيانات إلى صفحات
    const chunks = [];
    for (let i = 0; i < data.length; i += maxRowsPerPage) {
      chunks.push(data.slice(i, i + maxRowsPerPage));
    }

    const dimensions = analyzeReportDimensions(headers, data);
    const orientation = dimensions.recommendLandscape ? 'landscape' : 'portrait';
    
    const pdf = new jsPDF({
      orientation: orientation,
      unit: 'mm',
      format: 'a4'
    });

    // إنشاء كل صفحة
    for (let pageIndex = 0; pageIndex < chunks.length; pageIndex++) {
      const chunk = chunks[pageIndex];
      const pageTitle = `${title} - صفحة ${pageIndex + 1} من ${chunks.length}`;
      
      if (pageIndex > 0) {
        pdf.addPage(undefined, orientation);
      }

      // استخدام autoTable للأداء الأفضل مع الجداول الكبيرة
      (pdf as any).autoTable({
        head: [headers],
        body: chunk,
        startY: 30,
        styles: {
          font: 'helvetica',
          fontSize: dimensions.recommendLandscape ? 8 : 10,
          textColor: [44, 62, 80],
          cellPadding: 4,
        },
        headStyles: {
          fillColor: [102, 126, 234],
          textColor: 255,
          fontSize: dimensions.recommendLandscape ? 9 : 11,
          fontStyle: 'bold',
        },
        alternateRowStyles: {
          fillColor: [248, 249, 250],
        },
        margin: { top: 40, right: 14, bottom: 20, left: 14 },
        didDrawPage: function(data: any) {
          // Header
          pdf.setFontSize(16);
          pdf.text(pageTitle, data.settings.margin.left, 20);
        },
      });
    }

    pdf.save(filename);
    return true;
  } catch (error) {
    console.error('Error exporting large report:', error);
    return false;
  }
};
