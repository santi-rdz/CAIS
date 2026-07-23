import writeXlsxFile from 'write-excel-file/browser'
import { REPORT_COLORS } from '@features/estadisticas/export/reportTheme'

const { ink: INK, band: BAND, subtle: SUBTLE, borderStrong: BORDER } = REPORT_COLORS
const { muted: MUTED, text: TEXT, zebra: ZEBRA, white: WHITE } = REPORT_COLORS

const NCOLS = 3
const COLUMNS = [{ width: 40 }, { width: 16 }, { width: 12 }]

const base = (value, extra = {}) =>
  value == null ? null : { value, type: typeof value === 'number' ? Number : String, ...extra }

const titleRow = (text) => [
  base(text, { fontSize: 16, fontWeight: 'bold', textColor: INK, columnSpan: NCOLS, height: 24 }),
]
const subtitleRow = (text) => [base(text, { textColor: MUTED, columnSpan: NCOLS })]

const metaRow = (label, value) => [
  base(label, { fontWeight: 'bold', textColor: MUTED }),
  base(value, { textColor: INK, columnSpan: NCOLS - 1 }),
]

const sectionRow = (text) => [
  base(text, {
    fontWeight: 'bold',
    textColor: WHITE,
    backgroundColor: BAND,
    columnSpan: NCOLS,
    height: 20,
    alignVertical: 'center',
    indent: 1,
  }),
]

const headerRow = (columns) =>
  columns.map((col, i) =>
    base(col, {
      fontWeight: 'bold',
      textColor: INK,
      backgroundColor: SUBTLE,
      align: i === 0 ? 'left' : 'right',
      alignVertical: 'center',
      height: 18,
      bottomBorderColor: BORDER,
      bottomBorderStyle: 'medium',
      indent: i === 0 ? 1 : undefined,
    })
  )

const dataRow = (cells, zebra) =>
  cells.map((val, i) =>
    base(val, {
      textColor: TEXT,
      align: i === 0 ? 'left' : 'right',
      backgroundColor: zebra ? ZEBRA : WHITE,
      bottomBorderColor: SUBTLE,
      bottomBorderStyle: 'thin',
      indent: i === 0 ? 1 : undefined,
    })
  )

// Genera el .xlsx en el navegador y dispara la descarga vía `.toFile()`.
// write-excel-file es browser-first, así que no tiene el problema de bundling
// de ExcelJS en producción.
export async function exportStatsExcel(model, fileName) {
  const data = [
    titleRow(model.title),
    subtitleRow('Centro de Atención Integral para la Salud — UABC'),
    [],
  ]

  for (const [label, value] of model.meta) data.push(metaRow(label, value))
  data.push([])

  for (const section of model.sections) {
    data.push(sectionRow(section.title))
    data.push(headerRow(section.columns))
    if (section.rows.length === 0) {
      data.push([base('Sin datos', { textColor: MUTED, indent: 1, columnSpan: NCOLS })])
    } else {
      section.rows.forEach((row, i) => data.push(dataRow(row, i % 2 === 1)))
    }
    data.push([])
  }

  await writeXlsxFile(data, { columns: COLUMNS }).toFile(fileName)
}
