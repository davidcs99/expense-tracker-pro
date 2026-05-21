import type { CurrentMonthReport } from "@/types/api";

type ExportPayload = {
  report: CurrentMonthReport;
  title: string;
  subtitle: string;
  generatedFor: string;
  rangeLabel: string;
  averagePerDayLabel: string;
  topCategoryAmountLabel: string;
  totalAmountLabel: string;
  categoryRows: Array<{
    category: string;
    amountLabel: string;
    percentage: number;
  }>;
  monthlyRows: Array<{
    month: string;
    totalLabel: string;
    countLabel: string;
    percentage: number;
  }>;
};

function buildRows(rows: string[]) {
  return rows.join("");
}

function downloadFile(content: string, fileName: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
}

export function exportPremiumReportAsExcel(payload: ExportPayload) {
  const categoryRowsHtml = buildRows(
    payload.categoryRows.map(
      (row) => `
        <tr>
          <td>${row.category}</td>
          <td>${row.amountLabel}</td>
          <td>
            <div class="bar-cell">
              <div class="mini-track"><div class="mini-fill" style="width:${row.percentage}%"></div></div>
            </div>
          </td>
        </tr>
      `
    )
  );

  const monthlyRowsHtml = buildRows(
    payload.monthlyRows.map(
      (row) => `
        <tr>
          <td>${row.month}</td>
          <td>${row.totalLabel}</td>
          <td>${row.countLabel}</td>
          <td>
            <div class="bar-cell">
              <div class="mini-track"><div class="mini-fill" style="width:${row.percentage}%"></div></div>
            </div>
          </td>
        </tr>
      `
    )
  );

  const workbookHtml = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office"
          xmlns:x="urn:schemas-microsoft-com:office:excel"
          xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <meta charset="UTF-8" />
        <meta name="ProgId" content="Excel.Sheet" />
        <meta name="Generator" content="ExpenseTracker Pro" />
        <style>
          body {
            font-family: Arial, sans-serif;
            color: #1c2a3d;
            margin: 0;
            background: #edf3f8;
          }
          .sheet {
            padding: 24px;
          }
          .hero {
            padding: 24px;
            border-radius: 20px;
            color: white;
            background: linear-gradient(135deg, #2f7fb8, #4aa3df 55%, #8aa4bf);
            margin-bottom: 20px;
          }
          .hero__eyebrow {
            font-size: 12px;
            letter-spacing: 0.12em;
            text-transform: uppercase;
            opacity: 0.85;
          }
          .hero h1 {
            margin: 8px 0;
            font-size: 28px;
          }
          .hero__meta {
            margin-top: 14px;
            font-size: 13px;
          }
          .grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 12px;
            margin-bottom: 20px;
          }
          .metric-card, .card {
            border: 1px solid #d9e4ee;
            border-radius: 16px;
            background: white;
            padding: 16px;
          }
          .metric-label {
            color: #6f8098;
            font-size: 12px;
            margin-bottom: 6px;
          }
          .metric-value {
            font-size: 20px;
            font-weight: 700;
          }
          .card {
            margin-bottom: 18px;
          }
          .card h2 {
            margin: 0 0 10px;
            font-size: 18px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
          }
          th, td {
            border: 1px solid #d9e4ee;
            padding: 10px 12px;
            text-align: left;
            vertical-align: middle;
          }
          th {
            background: #eef4f9;
            color: #506178;
            font-weight: 700;
          }
          .mini-track {
            width: 180px;
            height: 10px;
            border-radius: 999px;
            background: #e6eef5;
            overflow: hidden;
          }
          .mini-fill {
            height: 100%;
            border-radius: 999px;
            background: linear-gradient(90deg, #8aa4bf, #4aa3df);
          }
        </style>
      </head>
      <body>
        <div class="sheet">
          <div class="hero">
            <div class="hero__eyebrow">ExpenseTracker Pro · Exportación Excel Premium</div>
            <h1>${payload.title}</h1>
            <div>${payload.subtitle}</div>
            <div class="hero__meta">
              Generado para: <strong>${payload.generatedFor}</strong><br />
              Rango: <strong>${payload.rangeLabel}</strong><br />
              Plan: <strong>${payload.report.reportType}</strong>
            </div>
          </div>

          <div class="grid">
            <div class="metric-card">
              <div class="metric-label">Total del período</div>
              <div class="metric-value">${payload.totalAmountLabel}</div>
            </div>
            <div class="metric-card">
              <div class="metric-label">Transacciones</div>
              <div class="metric-value">${payload.report.transactionCount}</div>
            </div>
            <div class="metric-card">
              <div class="metric-label">Categoría principal</div>
              <div class="metric-value">${payload.report.topCategory}</div>
            </div>
            <div class="metric-card">
              <div class="metric-label">Promedio por día</div>
              <div class="metric-value">${payload.averagePerDayLabel}</div>
            </div>
          </div>

          <div class="card">
            <h2>Gastos por categoría</h2>
            <table>
              <thead>
                <tr>
                  <th>Categoría</th>
                  <th>Monto</th>
                  <th>Visual</th>
                </tr>
              </thead>
              <tbody>
                ${categoryRowsHtml || '<tr><td colspan="3">Sin datos</td></tr>'}
              </tbody>
            </table>
          </div>

          <div class="card">
            <h2>Comparativa mensual</h2>
            <table>
              <thead>
                <tr>
                  <th>Mes</th>
                  <th>Total</th>
                  <th>Cantidad de gastos</th>
                  <th>Visual</th>
                </tr>
              </thead>
              <tbody>
                ${monthlyRowsHtml || '<tr><td colspan="4">Sin desglose mensual disponible</td></tr>'}
              </tbody>
            </table>
          </div>
        </div>
      </body>
    </html>
  `;

  downloadFile(
    workbookHtml,
    "expense-tracker-premium-report.xls",
    "application/vnd.ms-excel;charset=utf-8;"
  );
}

export function exportPremiumReportAsPdf(payload: ExportPayload) {
  const printWindow = window.open("", "_blank", "width=1100,height=800");

  if (!printWindow) {
    throw new Error("No se pudo abrir la ventana de impresión.");
  }

  const categoryRowsHtml = buildRows(
    payload.categoryRows.map(
      (row) => `
        <tr>
          <td>${row.category}</td>
          <td>
            <div class="bar-cell">
              <span>${row.amountLabel}</span>
              <div class="mini-track"><div class="mini-fill" style="width:${row.percentage}%"></div></div>
            </div>
          </td>
        </tr>
      `
    )
  );

  const monthlyRowsHtml = buildRows(
    payload.monthlyRows.map(
      (row) => `
        <tr>
          <td>${row.month}</td>
          <td>
            <div class="bar-cell">
              <span>${row.totalLabel}</span>
              <div class="mini-track"><div class="mini-fill" style="width:${row.percentage}%"></div></div>
            </div>
          </td>
          <td>${row.countLabel}</td>
        </tr>
      `
    )
  );

  printWindow.document.write(`
    <html>
      <head>
        <title>${payload.title}</title>
        <style>
          * { box-sizing: border-box; }
          body {
            font-family: "Segoe UI", Arial, sans-serif;
            color: #1c2a3d;
            margin: 0;
            background: #edf3f8;
            line-height: 1.5;
          }
          .page { padding: 32px; }
          .hero {
            padding: 32px;
            border-radius: 24px;
            color: white;
            background: linear-gradient(135deg, #2f7fb8, #4aa3df 55%, #8aa4bf);
            box-shadow: 0 18px 40px rgba(47, 127, 184, 0.18);
          }
          .hero__eyebrow { font-size: 12px; letter-spacing: 0.12em; text-transform: uppercase; opacity: 0.85; }
          .hero h1 { font-size: 30px; margin: 10px 0 8px; font-family: Georgia, "Times New Roman", serif; }
          .hero__subtitle { max-width: 70ch; opacity: 0.92; }
          .hero__meta { display: flex; gap: 24px; flex-wrap: wrap; margin-top: 20px; font-size: 14px; }
          .section { margin-top: 24px; }
          .section-title { margin: 0 0 12px; font-size: 20px; font-family: Georgia, "Times New Roman", serif; }
          .summary-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
          .metric-card, .content-card { background: white; border: 1px solid #d9e4ee; border-radius: 18px; box-shadow: 0 10px 24px rgba(47, 127, 184, 0.06); }
          .metric-card { padding: 18px; }
          .metric-label { color: #6f8098; font-size: 13px; margin-bottom: 8px; }
          .metric-value { font-size: 22px; font-weight: 700; color: #1c2a3d; }
          .content-grid { display: grid; grid-template-columns: 1.15fr 0.85fr; gap: 16px; }
          .content-card { padding: 20px; }
          .content-card h2 { margin: 0 0 12px; font-size: 18px; }
          .muted { color: #6f8098; }
          .pill { display: inline-block; padding: 6px 12px; border-radius: 999px; background: rgba(74, 163, 223, 0.12); color: #2f7fb8; font-weight: 600; font-size: 12px; }
          table { width: 100%; border-collapse: collapse; margin-top: 12px; overflow: hidden; border-radius: 14px; }
          th, td { border-bottom: 1px solid #d9e4ee; padding: 12px 14px; text-align: left; font-size: 14px; vertical-align: top; }
          th { background: #eef4f9; color: #506178; font-weight: 700; }
          tr:last-child td { border-bottom: none; }
          .bar-cell { display: grid; gap: 8px; }
          .mini-track { width: 100%; height: 10px; border-radius: 999px; background: #e6eef5; overflow: hidden; }
          .mini-fill { height: 100%; border-radius: 999px; background: linear-gradient(90deg, #8aa4bf, #4aa3df); }
          .footer { margin-top: 24px; text-align: center; color: #6f8098; font-size: 13px; }
          @media print { body { background: white; } .page { padding: 0; } }
        </style>
      </head>
      <body>
        <div class="page">
          <section class="hero">
            <div class="hero__eyebrow">ExpenseTracker Pro · Reporte Premium</div>
            <h1>${payload.title}</h1>
            <div class="hero__subtitle">${payload.subtitle}</div>
            <div class="hero__meta">
              <div>Generado para: <strong>${payload.generatedFor}</strong></div>
              <div>Rango: <strong>${payload.rangeLabel}</strong></div>
              <div>Plan: <strong>${payload.report.reportType}</strong></div>
            </div>
          </section>

          <section class="section">
            <h2 class="section-title">Resumen Ejecutivo</h2>
            <div class="summary-grid">
              <div class="metric-card"><div class="metric-label">Total del período</div><div class="metric-value">${payload.totalAmountLabel}</div></div>
              <div class="metric-card"><div class="metric-label">Transacciones</div><div class="metric-value">${payload.report.transactionCount}</div></div>
              <div class="metric-card"><div class="metric-label">Categoría principal</div><div class="metric-value">${payload.report.topCategory}</div></div>
              <div class="metric-card"><div class="metric-label">Promedio por día</div><div class="metric-value">${payload.averagePerDayLabel}</div></div>
            </div>
          </section>

          <section class="section">
            <div class="content-grid">
              <div class="content-card">
                <div class="pill">Comparativa por categoría</div>
                <h2>Distribución del gasto</h2>
                <table>
                  <thead><tr><th>Categoría</th><th>Monto</th></tr></thead>
                  <tbody>${categoryRowsHtml || '<tr><td colspan="2">Sin datos</td></tr>'}</tbody>
                </table>
              </div>

              <div class="content-card">
                <div class="pill">Insight premium</div>
                <h2>Detalle destacado</h2>
                <p><span class="muted">Categoría más costosa:</span> <strong>${payload.report.topCategory}</strong></p>
                <p><span class="muted">Monto de esa categoría:</span> <strong>${payload.topCategoryAmountLabel}</strong></p>
                <p><span class="muted">Promedio por día:</span> <strong>${payload.averagePerDayLabel}</strong></p>
                <p class="muted" style="margin-top: 18px;">
                  Este reporte resume el comportamiento financiero del período seleccionado y destaca los patrones
                  más relevantes para una lectura rápida y útil.
                </p>
              </div>
            </div>
          </section>

          <section class="section">
            <div class="content-card">
              <div class="pill">Comparativa mensual</div>
              <h2>Evolución por mes</h2>
              <table>
                <thead><tr><th>Mes</th><th>Total</th><th>Cantidad de gastos</th></tr></thead>
                <tbody>${monthlyRowsHtml || '<tr><td colspan="3">Sin desglose mensual disponible</td></tr>'}</tbody>
              </table>
            </div>
          </section>

          <div class="footer">Reporte generado desde ExpenseTracker Pro.</div>
        </div>
      </body>
    </html>
  `);

  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
}
