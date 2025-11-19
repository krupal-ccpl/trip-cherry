import pdfMake from 'pdfmake/build/pdfmake';
import 'pdfmake/build/vfs_fonts';

// Import images
import tripcherryLogo from '@/assets/tripcherry-logo.jpg';
import paypalIcon from '@/assets/paypal.jpg';
import signatureImg from '@/assets/signature.jpg';

// Function to convert image URL to data URL
function imageToDataURL(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      const dataURL = canvas.toDataURL('image/jpeg');
      resolve(dataURL);
    };
    img.onerror = reject;
    img.src = url;
  });
}

// Invoice interface
export interface InvoiceItem {
  descriptionLines: string[];
  hsnSac: string;
  pax: number;
  rate: number;
  amount: number;
}

export interface Invoice {
  invoiceNumber: string;
  invoiceDate: string;
  terms: string;
  dueDate: string;
  placeOfSupply: string;
  billTo: {
    name: string;
    addressLines: string[];
  };
  items: InvoiceItem[];
  subTotal: number;
  cgstRate: number;
  cgstAmount: number;
  sgstRate: number;
  sgstAmount: number;
  roundOff: number;
  total: number;
  totalInWords: string;
  balanceDue: number;
  footerNote?: string;
}

// Function to format numbers in Indian style
function formatIndianNumber(num: number): string {
  return num.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export async function generateInvoicePdf(invoice: Invoice, openInNewTab: boolean = true): Promise<void> {
  // Convert images to data URLs for pdfmake
  const [logoDataURL, paypalDataURL, headerDataURL] = await Promise.all([
    imageToDataURL(tripcherryLogo),
    imageToDataURL(paypalIcon),
    imageToDataURL(signatureImg)
  ]);

  // Document definition
  const docDefinition = {
    pageSize: 'A4',
    pageMargins: [25, 25, 25, 30], // left, top, right, bottom
    content: [
      // Header
      {
        columns: [
          {
            width: 'auto',
            image: logoDataURL,
            fit: [160, 160],
            alignment: 'center',
            margin: [0, 0, 10, 0]
          },
          {
            width: '*',
            stack: [
              { text: 'TripCherry Holidays', fontSize: 10, bold: true, margin: [0, 0, 0, 4] },
              { text: '313, Viral Heights, Above Croma Showroom,', fontSize: 8, margin: [0, 0, 0, 3] },
              { text: 'Ayodhya Chowk, 150 Feet Ring Road', fontSize: 8, margin: [0, 0, 0, 3] },
              { text: 'Rajkot Gujarat 360006', fontSize: 8, margin: [0, 0, 0, 3] },
              { text: 'India', fontSize: 8, margin: [0, 0, 0, 3] },
              { text: 'GSTIN 24AQKPN4431E1Z2', fontSize: 8, margin: [0, 0, 0, 0] }
            ],
            margin: [10, 0, 0, 0]
          },
          {
            width: 'auto',
            text: 'TAX INVOICE',
            fontSize: 20,
            bold: true,
            alignment: 'right',
            margin: [0, 8, 0, 0]
          }
        ],
        margin: [0, 0, 0, 10]
      },
      // Horizontal line
      {
        canvas: [
          {
            type: 'line',
            x1: 0,
            y1: 0,
            x2: 545, // Page width minus margins
            y2: 0,
            lineWidth: 0.6,
            lineColor: '#000000'
          }
        ],
        margin: [0, 0, 0, 8]
      },
      // Invoice details boxes
      {
        table: {
          widths: ['70%', '30%'],
          body: [
            [
              {
                table: {
                  widths: ['auto', '*'],
                  body: [
                    [
                      { text: 'Invoice No.', fontSize: 9, border: [false, false, false, false] },
                      { text: `: ${invoice.invoiceNumber}`, fontSize: 9, bold: true, border: [false, false, false, false] }
                    ],
                    [
                      { text: 'Invoice Date', fontSize: 9, border: [false, false, false, false] },
                      { text: `: ${invoice.invoiceDate}`, fontSize: 9, bold: true, border: [false, false, false, false] }
                    ],
                    [
                      { text: 'Terms', fontSize: 9, border: [false, false, false, false] },
                      { text: `: ${invoice.terms}`, fontSize: 9, bold: true, border: [false, false, false, false] }
                    ],
                    [
                      { text: 'Due Date', fontSize: 9, border: [false, false, false, false] },
                      { text: `: ${invoice.dueDate}`, fontSize: 9, bold: true, border: [false, false, false, false] }
                    ]
                  ]
                },
                layout: 'noBorders',
                margin: [4, 4, 4, 4]
              },
              {
                table: {
                  widths: ['auto', '*'],
                  body: [
                    [
                      { text: 'Place Of Supply', fontSize: 9, border: [false, false, false, false] },
                      { text: `: ${invoice.placeOfSupply}`, fontSize: 9, bold: true, border: [false, false, false, false] }
                    ]
                  ]
                },
                layout: 'noBorders',
                margin: [4, 4, 4, 4]
              }
            ]
          ]
        },
        layout: {
          hLineWidth: () => 0.6,
          vLineWidth: () => 0.6,
          hLineColor: () => '#000000',
          vLineColor: () => '#000000'
        },
        margin: [0, 0, 0, 0]
      },
      // Bill To section
      {
        table: {
          widths: ['*'],
          body: [
            [
              {
                text: 'Bill To',
                fontSize: 9,
                bold: true,
                fillColor: '#D3D3D3',
                margin: [4, 4, 0, 4]
              }
            ],
            [
              {
                stack: [
                  { text: invoice.billTo.name, fontSize: 9, bold: true, margin: [0, 0, 0, 2] },
                  ...invoice.billTo.addressLines.map(line => ({ text: line, fontSize: 9, margin: [0, 0, 0, 0] }))
                ],
                margin: [4, 4, 0, 4]
              }
            ]
          ]
        },
        layout: {
          hLineWidth: () => 0.6,
          vLineWidth: () => 0.6,
          hLineColor: () => '#000000',
          vLineColor: () => '#000000'
        },
        margin: [0, 0, 0, 0]
      },
      // Line items table
      {
        table: {
          widths: ['5%', '50%', '12%', '10%', '11%', '12%'],
          body: [
            // Header
            [
              { text: '#', fontSize: 9, bold: true, fillColor: '#F2F2F2', alignment: 'center', margin: [2, 3, 2, 3] },
              { text: 'Package & Description', fontSize: 9, bold: true, fillColor: '#F2F2F2', margin: [4, 3, 2, 3] },
              { text: 'HSN/SAC', fontSize: 9, bold: true, fillColor: '#F2F2F2', alignment: 'center', margin: [2, 3, 2, 3] },
              { text: 'No. of PAX', fontSize: 9, bold: true, fillColor: '#F2F2F2', alignment: 'center', margin: [2, 3, 2, 3] },
              { text: 'Rate', fontSize: 9, bold: true, fillColor: '#F2F2F2', alignment: 'right', margin: [2, 3, 4, 3] },
              { text: 'Amount', fontSize: 9, bold: true, fillColor: '#F2F2F2', alignment: 'right', margin: [2, 3, 4, 3] }
            ],
            // Items
            ...invoice.items.map((item, index) => [
              { text: (index + 1).toString(), fontSize: 9, alignment: 'center', margin: [2, 4, 2, 4] },
              {
                stack: [
                  { text: item.descriptionLines[0], fontSize: 9, bold: true, margin: [0, 0, 0, 1] },
                  ...item.descriptionLines.slice(1).map(line => ({ text: line, fontSize: 8, margin: [6, 0, 0, 0] }))
                ],
                margin: [4, 4, 2, 4]
              },
              { text: item.hsnSac, fontSize: 9, alignment: 'center', margin: [2, 4, 2, 4] },
              { text: item.pax.toString(), fontSize: 9, alignment: 'center', margin: [2, 4, 2, 4] },
              { text: formatIndianNumber(item.rate), fontSize: 9, alignment: 'right', margin: [2, 4, 4, 4] },
              { text: formatIndianNumber(item.amount), fontSize: 9, alignment: 'right', margin: [2, 4, 4, 4] }
            ])
          ]
        },
        layout: {
          hLineWidth: () => 0.6,
          vLineWidth: () => 0.6,
          hLineColor: () => '#000000',
          vLineColor: () => '#000000'
        },
        margin: [0, 0, 0, 0]
      },
      // Lower body
      {
        columns: [
          // Left column
          {
            width: '60%',
            stack: [
              // Total in words and Notes combined
              {
                table: {
                  widths: ['auto', '*'],
                  body: [
                    [
                      { text: 'Total In Words', fontSize: 9, bold: true, margin: [4, 3, 4, 3] },
                      { text: `Rupees ${invoice.totalInWords} Only`, fontSize: 9, margin: [4, 3, 4, 3] }
                    ],
                    [
                      { text: 'Notes', fontSize: 9, bold: true, margin: [4, 3, 4, 3] },
                      { text: 'Thanks for your business!', fontSize: 9, margin: [4, 3, 4, 3] }
                    ]
                  ]
                },
                layout: {
                  hLineWidth: () => 0.6,
                  vLineWidth: () => 0.6,
                  hLineColor: () => '#000000',
                  vLineColor: () => '#000000'
                },
                margin: [0, 0, 0, 6]
              },
              // Payment Options with icons
              {
                columns: [
                  { text: 'Payment Options', fontSize: 9, bold: true, width: 'auto', margin: [0, 0, 6, 0] },
                  { image: paypalDataURL, width: 40, height: 14, margin: [0, -2, 0, 0] }
                ],
                margin: [0, 0, 0, 6]
              },
              // Bank Details
              {
                text: 'Bank Details:',
                fontSize: 9,
                bold: true,
                margin: [0, 0, 0, 2]
              },
              {
                text: [
                  'Company Name: TripCherry Holidays\n',
                  'Bank Name: ICICI Bank\n',
                  'Branch: Rajkot\n',
                  'A/c Type: Current\n',
                  'A/c Number: 0153055014500\n',
                  'IFSC Code: ICIC0000153\n',
                  'OR\n',
                  'UPI ID: tripcherryholidays.lbz@icici'
                ],
                fontSize: 8,
                margin: [0, 0, 0, 6]
              },
              // Terms & Conditions
              {
                text: 'Terms & Conditions:',
                fontSize: 9,
                bold: true,
                margin: [0, 0, 0, 2]
              },
              {
                text: [
                  '#Subject to Rajkot Jurisdiction\n',
                  '#Without original invoice no refund is permissible\n',
                  '#Interest@24% will be charged on delayed payment\n',
                  '#Cheque to be drawn in the favor of "Company Name"\n',
                  '#Kindly check all the details necessary to avoid unnecessary complication'
                ],
                fontSize: 7.5
              }
            ]
          },
          // Right column
          {
            width: '40%',
            stack: [
              // Summary table
              {
                table: {
                  widths: ['60%', '40%'],
                  body: [
                    [
                      { text: 'Sub Total', fontSize: 9, margin: [4, 3, 2, 3] },
                      { text: formatIndianNumber(invoice.subTotal), fontSize: 9, alignment: 'right', margin: [2, 3, 4, 3] }
                    ],
                    [
                      { text: `CGST9 (${invoice.cgstRate}%)`, fontSize: 9, margin: [4, 3, 2, 3] },
                      { text: formatIndianNumber(invoice.cgstAmount), fontSize: 9, alignment: 'right', margin: [2, 3, 4, 3] }
                    ],
                    [
                      { text: `SGST9 (${invoice.sgstRate}%)`, fontSize: 9, margin: [4, 3, 2, 3] },
                      { text: formatIndianNumber(invoice.sgstAmount), fontSize: 9, alignment: 'right', margin: [2, 3, 4, 3] }
                    ],
                    [
                      { text: 'Round Off', fontSize: 9, margin: [4, 3, 2, 3] },
                      { text: invoice.roundOff < 0 ? `(${formatIndianNumber(Math.abs(invoice.roundOff))})` : formatIndianNumber(invoice.roundOff), fontSize: 9, alignment: 'right', margin: [2, 3, 4, 3] }
                    ],
                    [
                      { text: 'Total', fontSize: 9, bold: true, margin: [4, 3, 2, 3] },
                      { text: `₹${formatIndianNumber(invoice.total)}`, fontSize: 9, bold: true, alignment: 'right', margin: [2, 3, 4, 3] }
                    ],
                    [
                      { text: 'Balance Due', fontSize: 9, bold: true, margin: [4, 3, 2, 3] },
                      { text: `₹${formatIndianNumber(invoice.balanceDue)}`, fontSize: 9, bold: true, alignment: 'right', margin: [2, 3, 4, 3] }
                    ]
                  ]
                },
                layout: {
                  hLineWidth: () => 0.6,
                  vLineWidth: () => 0.6,
                  hLineColor: () => '#000000',
                  vLineColor: () => '#000000'
                },
                margin: [0, 0, 0, 10]
              },
              // Signature
              {
                stack: [
                  { image: headerDataURL, width: 140, height: 70, alignment: 'center', margin: [0, 0, 0, 4] },
                  { text: 'Authorized Signature', fontSize: 8, alignment: 'center', margin: [0, 0, 0, 0] }
                ],
                alignment: 'center'
              }
            ]
          }
        ]
      }
    ],
    styles: {
      header: {
        fontSize: 18,
        bold: true
      },
      subheader: {
        fontSize: 15,
        bold: true
      }
    },
    defaultStyle: {
      fontSize: 9
    },
    // Global table defaults
    tableLayouts: {
      default: {
        hLineWidth: () => 0.6,
        vLineWidth: () => 0.6,
        hLineColor: () => '#000000',
        vLineColor: () => '#000000',
        paddingLeft: () => 4,
        paddingRight: () => 4,
        paddingTop: () => 2,
        paddingBottom: () => 2
      }
    }
  };

  // Generate PDF
  const pdfDocGenerator = (pdfMake as any).createPdf(docDefinition as any);
  
  if (openInNewTab) {
    // Open in new tab for preview
    pdfDocGenerator.open();
  } else {
    // Download directly
    pdfDocGenerator.download(`Invoice_${invoice.invoiceNumber}.pdf`);
  }
}