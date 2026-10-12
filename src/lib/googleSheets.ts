import { google } from 'googleapis';

export type ContactSubmission = {
  rowIndex: number; // 1-indexed row number in Google Sheet (e.g., 2, 3...)
  timestamp: string;
  status: 'New' | 'In Progress' | 'Responded' | string;
  fullName: string;
  email: string;
  phone: string;
  academicLevel: string;
  subject: string;
  message: string;
  sourcePage: string;
};

export type ChecklistDownload = {
  rowIndex: number;
  timestamp: string;
  email: string;
  sourcePage: string;
};

export type GoogleSheetsData = {
  configured: boolean;
  contacts: ContactSubmission[];
  checklists: ChecklistDownload[];
  sheetId?: string;
  error?: string;
};

/**
 * Returns an authorized Google Sheets client using Service Account credentials.
 */
function getSheetsClient() {
  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  let privateKey = process.env.GOOGLE_PRIVATE_KEY;
  const sheetId = process.env.GOOGLE_SHEET_ID;

  if (!clientEmail || !privateKey || !sheetId) {
    return null;
  }

  // Handle raw private keys or stringified keys with literal \n
  privateKey = privateKey.replace(/\\n/g, '\n');

  const auth = new google.auth.JWT({
    email: clientEmail,
    key: privateKey,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  return { sheets: google.sheets({ version: 'v4', auth }), sheetId };
}

/**
 * Sample mock data shown when Google Service Account is not yet configured.
 */
function getMockData(): GoogleSheetsData {
  return {
    configured: false,
    sheetId: process.env.GOOGLE_SHEET_ID || 'DEMO-SHEET-ID',
    contacts: [
      {
        rowIndex: 2,
        timestamp: new Date(Date.now() - 1000 * 60 * 45).toLocaleString('en-GB'),
        status: 'New',
        fullName: 'Sarah Jenkins',
        email: 'sarah.j@ucl.ac.uk',
        phone: '+44 7911 123456',
        academicLevel: "Master's / MRes",
        subject: 'Educational Leadership & Policy',
        message:
          'I am preparing my dissertation proposal on leadership styles in secondary education. I need guidance with my research methodology and drafting literature review questions.',
        sourcePage: '/contact',
      },
      {
        rowIndex: 3,
        timestamp: new Date(Date.now() - 1000 * 60 * 180).toLocaleString('en-GB'),
        status: 'In Progress',
        fullName: 'Dr. Tariq Al-Mansoor',
        email: 'tariq.mansoor@warwick.ac.uk',
        phone: '+44 7822 654321',
        academicLevel: 'PhD / DBA',
        subject: 'Corporate Governance & ESG Performance',
        message:
          'Received Revise & Resubmit from journal reviewers regarding statistical regression model in chapter 4. Looking for specialized quantitative assistance in Stata.',
        sourcePage: '/services/phd-support',
      },
      {
        rowIndex: 4,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toLocaleString('en-GB'),
        status: 'Responded',
        fullName: 'Liam O’Connor',
        email: 'liam.oc@kcl.ac.uk',
        phone: '+44 7733 987654',
        academicLevel: 'Undergraduate',
        subject: 'Economics & Behavioral Finance',
        message:
          'Final year dissertation proofreading and Harvard referencing compliance check needed before submission next month.',
        sourcePage: '/contact',
      },
    ],
    checklists: [
      {
        rowIndex: 2,
        timestamp: new Date(Date.now() - 1000 * 60 * 20).toLocaleString('en-GB'),
        email: 'emily.turner@ox.ac.uk',
        sourcePage: '/',
      },
      {
        rowIndex: 3,
        timestamp: new Date(Date.now() - 1000 * 60 * 120).toLocaleString('en-GB'),
        email: 'ahmed.k@manchester.ac.uk',
        sourcePage: '/services/research-proposal',
      },
      {
        rowIndex: 4,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 18).toLocaleString('en-GB'),
        email: 'claire.watson@ed.ac.uk',
        sourcePage: '/resources/how-to-write-research-proposal',
      },
    ],
  };
}

/**
 * Fetches all submissions from the Google Sheet tabs.
 */
export async function fetchAllSubmissions(): Promise<GoogleSheetsData> {
  const clientInfo = getSheetsClient();

  if (!clientInfo) {
    return getMockData();
  }

  const { sheets, sheetId } = clientInfo;

  try {
    // Get all available sheet tab titles
    const metaResponse = await sheets.spreadsheets.get({
      spreadsheetId: sheetId,
      fields: 'sheets.properties.title',
    });
    const sheetTitles = (metaResponse.data.sheets || []).map((s) =>
      (s.properties?.title || '').trim().toLowerCase()
    );

    const contactTabName =
      (metaResponse.data.sheets || []).find((s) =>
        (s.properties?.title || '').trim().toLowerCase() === 'contact submissions'
      )?.properties?.title || 'Contact Submissions';

    // 1. Fetch Contact Submissions tab if available
    const contacts: ContactSubmission[] = [];
    if (sheetTitles.includes(contactTabName.toLowerCase())) {
      const contactsResponse = await sheets.spreadsheets.values.get({
        spreadsheetId: sheetId,
        range: `'${contactTabName}'!A1:Z500`,
      });

      const contactRows = contactsResponse.data.values || [];

      if (contactRows.length > 1) {
        const headerRow = contactRows[0].map((h) => String(h || '').trim().toLowerCase());

        const getCol = (row: (string | undefined)[], possibleHeaders: string[], fallbackIndex: number) => {
          const foundIdx = headerRow.findIndex((h) => possibleHeaders.some((ph) => h.includes(ph)));
          const idx = foundIdx !== -1 ? foundIdx : fallbackIndex;
          return row[idx] ? String(row[idx]).trim() : '';
        };

        for (let i = 1; i < contactRows.length; i++) {
          const row = contactRows[i];
          if (!row || row.length === 0 || !row.some((cell) => Boolean(cell))) continue;

          const timestamp = getCol(row, ['time', 'date'], 0);
          const status = getCol(row, ['status'], 1) || '🔴 New';
          const fullName = getCol(row, ['name', 'full name', 'student'], 3);
          const email = getCol(row, ['email', 'mail', 'address'], 4);
          const phone = getCol(row, ['phone', 'whatsapp', 'tel'], 5);
          const academicLevel = getCol(row, ['level', 'academic level'], 6);
          const subject = getCol(row, ['subject', 'research area', 'area'], 7);
          const message = getCol(row, ['message', 'help', 'details', 'notes'], 8);
          const sourcePage = getCol(row, ['source', 'page', 'url', 'form'], 2) || '/contact';

          contacts.push({
            rowIndex: i + 1, // 1-indexed (Row 1 is headers)
            timestamp,
            status,
            fullName,
            email,
            phone,
            academicLevel,
            subject,
            message,
            sourcePage,
          });
        }
      }
    }

    // 2. Fetch Checklist Downloads tab if available
    let checklists: ChecklistDownload[] = [];
    const checklistTabName = (metaResponse.data.sheets || []).find((s) =>
      (s.properties?.title || '').trim().toLowerCase() === 'checklist downloads'
    )?.properties?.title;

    if (checklistTabName) {
      try {
        const checklistResponse = await sheets.spreadsheets.values.get({
          spreadsheetId: sheetId,
          range: `'${checklistTabName}'!A1:Z500`,
        });

        const checklistRows = checklistResponse.data.values || [];
        if (checklistRows.length > 1) {
          const headerRow = checklistRows[0].map((h) => String(h || '').trim().toLowerCase());

          const getCol = (row: (string | undefined)[], possibleHeaders: string[], fallbackIndex: number) => {
            const foundIdx = headerRow.findIndex((h) => possibleHeaders.some((ph) => h.includes(ph)));
            const idx = foundIdx !== -1 ? foundIdx : fallbackIndex;
            return row[idx] ? String(row[idx]).trim() : '';
          };

          for (let i = 1; i < checklistRows.length; i++) {
            const row = checklistRows[i];
            if (!row || row.length === 0 || !row.some((cell) => Boolean(cell))) continue;

            const timestamp = getCol(row, ['time', 'date'], 0);
            const email = getCol(row, ['email'], 1);
            const sourcePage = getCol(row, ['source', 'page', 'url', 'form'], 2) || '/';

            checklists.push({
              rowIndex: i + 1,
              timestamp,
              email,
              sourcePage,
            });
          }
        }
      } catch (checklistErr) {
        console.warn('Checklist Downloads tab query issue:', checklistErr);
      }
    }

    return {
      configured: true,
      sheetId,
      contacts,
      checklists,
    };
  } catch (error) {
    console.error('Error fetching data from Google Sheets:', error);
    const mock = getMockData();
    mock.error = error instanceof Error ? error.message : 'Unknown Google Sheets API error';
    return mock;
  }
}

/**
 * Updates the status cell for a specific contact submission row in the Google Sheet.
 */
export async function updateContactStatusInSheet(
  rowIndex: number,
  newStatus: string
): Promise<{ success: boolean; message: string }> {
  const clientInfo = getSheetsClient();

  if (!clientInfo) {
    return {
      success: false,
      message: 'Google Service Account is not configured in .env.local yet.',
    };
  }

  const { sheets, sheetId } = clientInfo;

  try {
    // 1. First get header row to find which column holds 'Status'
    const headersResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: `'Contact Submissions'!A1:Z1`,
    });

    const headers = (headersResponse.data.values?.[0] || []).map((h) =>
      String(h || '').trim().toLowerCase()
    );

    let statusColIndex = headers.findIndex((h) => h.includes('status'));

    // If 'Status' column doesn't exist, use Column B (index 1) by default
    if (statusColIndex === -1) {
      statusColIndex = 1;
    }

    // Convert 0-indexed column number to Excel/Sheets column letter (0 -> A, 1 -> B, ...)
    const colLetter = String.fromCharCode(65 + statusColIndex);
    const cellRange = `'Contact Submissions'!${colLetter}${rowIndex}`;

    await sheets.spreadsheets.values.update({
      spreadsheetId: sheetId,
      range: cellRange,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [[newStatus]],
      },
    });

    return {
      success: true,
      message: `Updated row ${rowIndex} status to "${newStatus}" in ${cellRange}`,
    };
  } catch (error) {
    console.error('Error updating status in Google Sheet:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to update Google Sheet',
    };
  }
}
