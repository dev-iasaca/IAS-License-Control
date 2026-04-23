export type ExportCell = string | number | null | undefined;

export type ExportColumn<T> = {
  header: string;
  get: (row: T) => ExportCell;
};

export type ExportOptions<T> = {
  fileName: string;
  sheetName?: string;
  columns: ExportColumn<T>[];
  rows: T[];
};

const ENCODER = new TextEncoder();

export function exportToXlsx<T>(opts: ExportOptions<T>): void {
  const { fileName, sheetName = 'Sheet1', columns, rows } = opts;
  const sheetXml = buildSheetXml(columns, rows);
  const files: Array<{ path: string; data: string }> = [
    { path: '[Content_Types].xml', data: CONTENT_TYPES_XML },
    { path: '_rels/.rels', data: ROOT_RELS_XML },
    { path: 'xl/workbook.xml', data: buildWorkbookXml(sheetName) },
    { path: 'xl/_rels/workbook.xml.rels', data: WORKBOOK_RELS_XML },
    { path: 'xl/worksheets/sheet1.xml', data: sheetXml },
  ];
  const blob = buildXlsxBlob(files);
  triggerDownload(blob, fileName.endsWith('.xlsx') ? fileName : `${fileName}.xlsx`);
}

function escapeXml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function sanitizeSheetName(name: string): string {
  return (name || 'Sheet1').replace(/[\\/?*\[\]:]/g, ' ').slice(0, 31) || 'Sheet1';
}

function colLetter(n: number): string {
  let s = '';
  let x = n;
  do {
    s = String.fromCharCode(65 + (x % 26)) + s;
    x = Math.floor(x / 26) - 1;
  } while (x >= 0);
  return s;
}

function buildSheetXml<T>(columns: ExportColumn<T>[], rows: T[]): string {
  const parts: string[] = [];
  parts.push('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>');
  parts.push('<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetData>');
  parts.push('<row r="1">');
  columns.forEach((col, i) => {
    parts.push(
      `<c r="${colLetter(i)}1" t="inlineStr"><is><t xml:space="preserve">${escapeXml(col.header)}</t></is></c>`,
    );
  });
  parts.push('</row>');
  rows.forEach((row, r) => {
    const rNum = r + 2;
    parts.push(`<row r="${rNum}">`);
    columns.forEach((col, i) => {
      const val = col.get(row);
      if (val === null || val === undefined || val === '') return;
      const ref = `${colLetter(i)}${rNum}`;
      if (typeof val === 'number' && Number.isFinite(val)) {
        parts.push(`<c r="${ref}"><v>${val}</v></c>`);
      } else {
        parts.push(
          `<c r="${ref}" t="inlineStr"><is><t xml:space="preserve">${escapeXml(String(val))}</t></is></c>`,
        );
      }
    });
    parts.push('</row>');
  });
  parts.push('</sheetData></worksheet>');
  return parts.join('');
}

const CONTENT_TYPES_XML =
  '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
  '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">' +
  '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>' +
  '<Default Extension="xml" ContentType="application/xml"/>' +
  '<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>' +
  '<Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>' +
  '</Types>';

const ROOT_RELS_XML =
  '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
  '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' +
  '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>' +
  '</Relationships>';

const WORKBOOK_RELS_XML =
  '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
  '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' +
  '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>' +
  '</Relationships>';

function buildWorkbookXml(sheetName: string): string {
  return (
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
    '<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" ' +
    'xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">' +
    `<sheets><sheet name="${escapeXml(sanitizeSheetName(sheetName))}" sheetId="1" r:id="rId1"/></sheets>` +
    '</workbook>'
  );
}

let CRC_TABLE: Uint32Array | null = null;
function crc32(bytes: Uint8Array): number {
  if (!CRC_TABLE) {
    const t = new Uint32Array(256);
    for (let n = 0; n < 256; n++) {
      let c = n;
      for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
      t[n] = c >>> 0;
    }
    CRC_TABLE = t;
  }
  const table = CRC_TABLE;
  let crc = 0xffffffff;
  for (let i = 0; i < bytes.length; i++) {
    crc = (table[(crc ^ bytes[i]) & 0xff] ^ (crc >>> 8)) >>> 0;
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function triggerDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function buildXlsxBlob(files: Array<{ path: string; data: string }>): Blob {
  const now = new Date();
  const dosTime =
    ((now.getHours() & 0x1f) << 11) |
    ((now.getMinutes() & 0x3f) << 5) |
    ((now.getSeconds() >>> 1) & 0x1f);
  const dosDate =
    (((now.getFullYear() - 1980) & 0x7f) << 9) |
    (((now.getMonth() + 1) & 0x0f) << 5) |
    (now.getDate() & 0x1f);

  const encoded = files.map((f) => {
    const nameBytes = ENCODER.encode(f.path);
    const bytes = ENCODER.encode(f.data);
    return { nameBytes, bytes, crc: crc32(bytes) };
  });

  const parts: BlobPart[] = [];
  const centrals: Uint8Array[] = [];
  let offset = 0;

  for (const f of encoded) {
    const local = new Uint8Array(30 + f.nameBytes.length);
    const lv = new DataView(local.buffer);
    lv.setUint32(0, 0x04034b50, true);
    lv.setUint16(4, 20, true);
    lv.setUint16(6, 0, true);
    lv.setUint16(8, 0, true);
    lv.setUint16(10, dosTime, true);
    lv.setUint16(12, dosDate, true);
    lv.setUint32(14, f.crc, true);
    lv.setUint32(18, f.bytes.length, true);
    lv.setUint32(22, f.bytes.length, true);
    lv.setUint16(26, f.nameBytes.length, true);
    lv.setUint16(28, 0, true);
    local.set(f.nameBytes, 30);
    parts.push(local, f.bytes);

    const central = new Uint8Array(46 + f.nameBytes.length);
    const cv = new DataView(central.buffer);
    cv.setUint32(0, 0x02014b50, true);
    cv.setUint16(4, 20, true);
    cv.setUint16(6, 20, true);
    cv.setUint16(8, 0, true);
    cv.setUint16(10, 0, true);
    cv.setUint16(12, dosTime, true);
    cv.setUint16(14, dosDate, true);
    cv.setUint32(16, f.crc, true);
    cv.setUint32(20, f.bytes.length, true);
    cv.setUint32(24, f.bytes.length, true);
    cv.setUint16(28, f.nameBytes.length, true);
    cv.setUint32(42, offset, true);
    central.set(f.nameBytes, 46);
    centrals.push(central);

    offset += local.length + f.bytes.length;
  }

  const centralSize = centrals.reduce((s, b) => s + b.length, 0);
  const centralOffset = offset;
  parts.push(...centrals);

  const eocd = new Uint8Array(22);
  const ev = new DataView(eocd.buffer);
  ev.setUint32(0, 0x06054b50, true);
  ev.setUint16(8, encoded.length, true);
  ev.setUint16(10, encoded.length, true);
  ev.setUint32(12, centralSize, true);
  ev.setUint32(16, centralOffset, true);
  parts.push(eocd);

  return new Blob(parts, {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
}
