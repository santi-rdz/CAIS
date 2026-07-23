import { Document, Page, View, Text, StyleSheet } from '@react-pdf/renderer'
import { REPORT_COLORS as C } from '@features/estadisticas/export/reportTheme'

const styles = StyleSheet.create({
  page: {
    paddingTop: 40,
    paddingBottom: 48,
    paddingHorizontal: 44,
    fontSize: 10,
    color: C.text,
  },
  header: { borderBottomWidth: 2, borderBottomColor: C.ink, paddingBottom: 10, marginBottom: 16 },
  title: { fontSize: 17, fontWeight: 'bold', color: C.ink, letterSpacing: 0.3 },
  subtitle: { fontSize: 9.5, color: C.muted, marginTop: 3 },
  metaGrid: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 22 },
  metaItem: { width: '50%', marginBottom: 5, flexDirection: 'row' },
  metaLabel: { color: C.muted, width: 78, fontSize: 9 },
  metaValue: { color: C.ink, fontSize: 9, fontWeight: 'bold' },

  section: { marginBottom: 16 },
  sectionBar: {
    backgroundColor: C.band,
    paddingVertical: 5,
    paddingHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sectionTitle: { fontSize: 10.5, fontWeight: 'bold', color: C.white, letterSpacing: 0.4 },
  sectionMeta: { fontSize: 8.5, color: C.borderStrong },

  table: { borderWidth: 1, borderColor: C.border, borderTopWidth: 0 },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: C.subtle,
    borderBottomWidth: 1,
    borderBottomColor: C.borderStrong,
  },
  row: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: C.border },
  lastRow: { flexDirection: 'row' },
  zebra: { backgroundColor: C.zebra },
  cell: { paddingVertical: 5, paddingHorizontal: 10, fontSize: 9.5 },
  headerCell: { color: C.ink, fontWeight: 'bold', fontSize: 9 },

  footer: {
    position: 'absolute',
    bottom: 26,
    left: 44,
    right: 44,
    borderTopWidth: 1,
    borderTopColor: C.border,
    paddingTop: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 8,
    color: C.muted,
  },
})

// Primera columna flexible; las de datos, fijas y alineadas a la derecha.
function colStyle(index, total) {
  if (index === 0) return { flex: 1 }
  return { width: 78, textAlign: total > 2 ? 'right' : 'left' }
}

function Table({ columns, rows }) {
  return (
    <View style={styles.table}>
      <View style={styles.headerRow}>
        {columns.map((col, i) => (
          <Text key={col} style={[styles.cell, styles.headerCell, colStyle(i, columns.length)]}>
            {col}
          </Text>
        ))}
      </View>
      {rows.length === 0 ? (
        <View style={styles.lastRow}>
          <Text style={[styles.cell, { color: C.muted }]}>Sin datos</Text>
        </View>
      ) : (
        rows.map((row, r) => (
          <View
            key={r}
            style={[
              r === rows.length - 1 ? styles.lastRow : styles.row,
              r % 2 === 1 && styles.zebra,
            ]}
          >
            {row.map((val, c) => (
              <Text key={c} style={[styles.cell, colStyle(c, columns.length)]}>
                {String(val)}
              </Text>
            ))}
          </View>
        ))
      )}
    </View>
  )
}

export default function StatsPdfDocument({ model }) {
  return (
    <Document title={model.title}>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>{model.title}</Text>
          <Text style={styles.subtitle}>Centro de Atención Integral para la Salud — UABC</Text>
        </View>

        <View style={styles.metaGrid}>
          {model.meta.map(([label, value]) => (
            <View key={label} style={styles.metaItem}>
              <Text style={styles.metaLabel}>{label}</Text>
              <Text style={styles.metaValue}>{value}</Text>
            </View>
          ))}
        </View>

        {model.sections.map((section) => (
          <View key={section.title} style={styles.section} wrap={false}>
            <View style={styles.sectionBar}>
              <Text style={styles.sectionTitle}>{section.title.toUpperCase()}</Text>
              {section.total != null && (
                <Text style={styles.sectionMeta}>Total: {section.total}</Text>
              )}
            </View>
            <Table columns={section.columns} rows={section.rows} />
          </View>
        ))}

        <View style={styles.footer} fixed>
          <Text>Centro de Atención Integral para la Salud — UABC</Text>
          <Text render={({ pageNumber, totalPages }) => `Página ${pageNumber} de ${totalPages}`} />
        </View>
      </Page>
    </Document>
  )
}
