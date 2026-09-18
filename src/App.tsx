import { useMemo, useState } from 'react';
import {
  ArrowDownToLine,
  ChevronDown,
  FileText,
  Minus,
  Plus,
  Printer,
  ReceiptText,
  RotateCcw,
  Settings2,
  ShoppingBag,
  Sparkles,
  Trash2,
} from 'lucide-react';

type PaperSize = 'thermal' | 'a4';
type OrderItem = { id: number; name: string; qty: number; rate: number };

const initialItems: OrderItem[] = [
  { id: 1, name: 'Paneer Tikka Platter', qty: 1, rate: 320 },
  { id: 2, name: 'Butter Garlic Naan', qty: 2, rate: 85 },
  { id: 3, name: 'Dal Makhani', qty: 1, rate: 240 },
  { id: 4, name: 'Fresh Lime Soda', qty: 2, rate: 90 },
];

const defaultRestaurant = {
  name: 'The Copper Chimney',
  tagline: 'Modern Indian Kitchen',
  address: '14, Riverwalk Avenue, Indiranagar',
  phone: '+91 80 4123 8899',
  gstin: '29AABCT8472K1Z5',
};

const money = (value: number) => `₹${value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const invoiceDate = '18 Sep 2026';
const invoiceTime = '08:41 PM';

const ones = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

function twoDigits(n: number): string {
  if (n < 20) return ones[n];
  return tens[Math.floor(n / 10)] + (n % 10 ? ' ' + ones[n % 10] : '');
}

function threeDigits(n: number): string {
  const h = Math.floor(n / 100);
  const r = n % 100;
  let str = '';
  if (h) str += ones[h] + ' hundred';
  if (r) str += (h ? ' ' : '') + twoDigits(r);
  return str;
}

function numberToWords(num: number): string {
  if (num === 0) return 'zero rupees only';
  const crore = Math.floor(num / 10000000);
  num %= 10000000;
  const lakh = Math.floor(num / 100000);
  num %= 100000;
  const thousand = Math.floor(num / 1000);
  num %= 1000;
  const rest = num;

  const parts: string[] = [];
  if (crore) parts.push(twoDigits(crore) + ' crore');
  if (lakh) parts.push(twoDigits(lakh) + ' lakh');
  if (thousand) parts.push(twoDigits(thousand) + ' thousand');
  if (rest) parts.push(threeDigits(rest));

  return parts.join(' ').replace(/\b\w/g, (c) => c.toUpperCase()) + ' rupees only';
}

function App() {
  const [paperSize, setPaperSize] = useState<PaperSize>('thermal');
  const [items, setItems] = useState<OrderItem[]>(initialItems);
  const [customer, setCustomer] = useState('Aarav Mehta');
  const [table, setTable] = useState('T-06');
  const [payment, setPayment] = useState('UPI');
  const [discount, setDiscount] = useState(50);
  const [gstRate, setGstRate] = useState(5);
  const [restaurant, setRestaurant] = useState(defaultRestaurant);
  const [showEditor, setShowEditor] = useState(true);

  const halfGstRate = gstRate / 2;
  const subtotal = useMemo(() => items.reduce((sum, item) => sum + item.qty * item.rate, 0), [items]);
  const taxable = Math.max(0, subtotal - discount);
  const cgst = taxable * (halfGstRate / 100);
  const sgst = taxable * (halfGstRate / 100);
  const total = Math.round(taxable + cgst + sgst);
  const amountReceived = total;
  const amountInWords = useMemo(() => numberToWords(total), [total]);

  const updateItem = (id: number, field: 'qty' | 'rate', value: number) => {
    setItems((current) => current.map((item) => item.id === id ? { ...item, [field]: Math.max(0, value) } : item));
  };

  const addItem = () => {
    const id = Math.max(0, ...items.map((item) => item.id)) + 1;
    setItems((current) => [...current, { id, name: 'New menu item', qty: 1, rate: 0 }]);
  };

  const resetInvoice = () => {
    setItems(initialItems);
    setCustomer('Aarav Mehta');
    setTable('T-06');
    setPayment('UPI');
    setDiscount(50);
    setGstRate(5);
    setRestaurant(defaultRestaurant);
  };

  const printInvoice = () => {
    window.print();
  };

  const updateRestaurant = (field: keyof typeof restaurant, value: string) => {
    setRestaurant((current) => ({ ...current, [field]: value }));
  };

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand-lockup">
          <div className="brand-mark"><ReceiptText size={21} strokeWidth={2.4} /></div>
          <div>
            <div className="brand-name">Bill<span>Bite</span></div>
            <div className="brand-caption">Restaurant billing, made simple</div>
          </div>
        </div>
        <div className="topbar-actions">
          <div className="sync-state"><span className="status-dot" /> All changes saved</div>
          <button className="icon-button" aria-label="Settings"><Settings2 size={18} /></button>
          <div className="avatar">AK</div>
        </div>
      </header>

      <div className="workspace">
        <aside className={`editor-panel ${showEditor ? '' : 'collapsed'}`}>
          <div className="panel-heading">
            <div><p className="eyebrow">New transaction</p><h1>Build your bill</h1></div>
            <button className="collapse-button" onClick={() => setShowEditor((value) => !value)} aria-label="Toggle editor"><ChevronDown size={18} /></button>
          </div>
          <div className="editor-content">
            <section className="editor-section">
              <div className="section-title"><span className="section-number">01</span><h2>Restaurant details</h2></div>
              <label>Restaurant name<input value={restaurant.name} onChange={(event) => updateRestaurant('name', event.target.value)} /></label>
              <label>Tagline<input value={restaurant.tagline} onChange={(event) => updateRestaurant('tagline', event.target.value)} /></label>
              <label>Address<input value={restaurant.address} onChange={(event) => updateRestaurant('address', event.target.value)} /></label>
              <div className="field-grid two-col">
                <label>Phone<input value={restaurant.phone} onChange={(event) => updateRestaurant('phone', event.target.value)} /></label>
                <label>GSTIN<input value={restaurant.gstin} onChange={(event) => updateRestaurant('gstin', event.target.value)} /></label>
              </div>
            </section>

            <section className="editor-section">
              <div className="section-title"><span className="section-number">02</span><h2>Order details</h2></div>
              <div className="field-grid two-col">
                <label>Bill number<input value="BB-240918-078" readOnly /></label>
                <label>Table / order<input value={table} onChange={(event) => setTable(event.target.value)} /></label>
              </div>
              <div className="field-grid two-col">
                <label>Customer name<input value={customer} onChange={(event) => setCustomer(event.target.value)} /></label>
                <label>Payment method<select value={payment} onChange={(event) => setPayment(event.target.value)}><option>UPI</option><option>Cash</option><option>Card</option></select></label>
              </div>
            </section>

            <section className="editor-section items-section">
              <div className="section-title"><span className="section-number">03</span><h2>Menu items <span className="item-count">{items.length}</span></h2></div>
              <div className="item-editor-head"><span>Item</span><span>Qty</span><span>Rate</span><span /></div>
              <div className="item-list">
                {items.map((item) => (
                  <div className="item-editor-row" key={item.id}>
                    <input value={item.name} onChange={(event) => setItems((current) => current.map((entry) => entry.id === item.id ? { ...entry, name: event.target.value } : entry))} />
                    <div className="stepper"><button onClick={() => updateItem(item.id, 'qty', item.qty - 1)} aria-label="Decrease quantity"><Minus size={13} /></button><span>{item.qty}</span><button onClick={() => updateItem(item.id, 'qty', item.qty + 1)} aria-label="Increase quantity"><Plus size={13} /></button></div>
                    <div className="rate-field"><span>₹</span><input type="number" value={item.rate} onChange={(event) => updateItem(item.id, 'rate', Number(event.target.value))} /></div>
                    <button className="delete-button" onClick={() => setItems((current) => current.filter((entry) => entry.id !== item.id))} aria-label={`Remove ${item.name}`}><Trash2 size={15} /></button>
                  </div>
                ))}
              </div>
              <button className="add-item-button" onClick={addItem}><Plus size={16} /> Add menu item</button>
            </section>

            <section className="editor-section">
              <div className="section-title"><span className="section-number">04</span><h2>Adjustments</h2></div>
              <div className="summary-edit-row"><span>Discount</span><label className="money-input"><span>₹</span><input type="number" value={discount} onChange={(event) => setDiscount(Number(event.target.value))} /></label></div>
              <div className="summary-edit-row"><span>GST rate</span><label className="money-input"><input type="number" value={gstRate} onChange={(event) => setGstRate(Number(event.target.value))} /><span>%</span></label></div>
              <div className="summary-edit-row muted"><span>Split</span><span>CGST {halfGstRate}% · SGST {halfGstRate}%</span></div>
            </section>
          </div>
          <div className="editor-footer"><button className="reset-button" onClick={resetInvoice}><RotateCcw size={15} /> Reset bill</button><button className="save-button" onClick={printInvoice}><Printer size={16} /> Print bill</button></div>
        </aside>

        <section className="preview-panel">
          <div className="preview-toolbar">
            <div><p className="eyebrow">Live preview</p><h2>Your invoice, ready to serve</h2></div>
            <div className="preview-actions"><button className="secondary-action" onClick={printInvoice}><Printer size={16} /> Print</button><button className="primary-action" onClick={printInvoice}><ArrowDownToLine size={16} /> Download PDF</button></div>
          </div>
          <div className="paper-switcher"><button className={paperSize === 'thermal' ? 'active' : ''} onClick={() => setPaperSize('thermal')}><ReceiptText size={16} /> 80mm receipt</button><button className={paperSize === 'a4' ? 'active' : ''} onClick={() => setPaperSize('a4')}><FileText size={16} /> A4 invoice</button></div>
          <div className="preview-stage">
            <Invoice paperSize={paperSize} items={items} customer={customer} table={table} payment={payment} discount={discount} restaurant={restaurant} halfGstRate={halfGstRate} subtotal={subtotal} taxable={taxable} cgst={cgst} sgst={sgst} total={total} amountReceived={amountReceived} amountInWords={amountInWords} />
          </div>
          <div className="preview-note"><Sparkles size={15} /><span>Print-ready preview</span><span className="note-divider" /> <span>Every detail updates as you type</span></div>
        </section>
      </div>
    </main>
  );
}

type Restaurant = typeof defaultRestaurant;

type InvoiceProps = {
  paperSize: PaperSize;
  items: OrderItem[];
  customer: string;
  table: string;
  payment: string;
  discount: number;
  restaurant: Restaurant;
  halfGstRate: number;
  subtotal: number;
  taxable: number;
  cgst: number;
  sgst: number;
  total: number;
  amountReceived: number;
  amountInWords: string;
};

function Invoice({ paperSize, items, customer, table, payment, discount, restaurant, halfGstRate, subtotal, taxable, cgst, sgst, total, amountReceived, amountInWords }: InvoiceProps) {
  const isThermal = paperSize === 'thermal';
  return (
    <article className={`invoice ${isThermal ? 'thermal-invoice' : 'a4-invoice'}`}>
      {isThermal ? <ThermalHeader table={table} customer={customer} restaurant={restaurant} /> : <A4Header table={table} customer={customer} restaurant={restaurant} />}
      <div className="invoice-items">
        <div className="invoice-table-head"><span>Item description</span><span>Qty</span><span>Rate</span><span>Amount</span></div>
        {items.map((item) => <div className="invoice-item" key={item.id}><span>{item.name}</span><span>{item.qty}</span><span>{money(item.rate)}</span><span>{money(item.qty * item.rate)}</span></div>)}
      </div>
      <div className="invoice-totals">
        <div><span>Subtotal</span><strong>{money(subtotal)}</strong></div>
        <div><span>Discount</span><strong>- {money(discount)}</strong></div>
        <div><span>Taxable value</span><strong>{money(taxable)}</strong></div>
        <div><span>CGST <small>{halfGstRate}%</small></span><strong>{money(cgst)}</strong></div>
        <div><span>SGST <small>{halfGstRate}%</small></span><strong>{money(sgst)}</strong></div>
        <div className="grand-total"><span>Grand total</span><strong>{money(total)}</strong></div>
      </div>
      <div className="payment-block"><div><span>Paid via</span><strong>{payment}</strong></div><div><span>Amount received</span><strong>{money(amountReceived)}</strong></div><div><span>Change due</span><strong>{money(Math.max(0, amountReceived - total))}</strong></div></div>
      {!isThermal && <div className="amount-words"><span>Amount in words</span><strong>{amountInWords}</strong></div>}
      <div className="invoice-footer"><strong>Thank you for dining with us.</strong><span>We hope to see you again soon.</span><small>Powered by BillBite · billbite.in</small></div>
    </article>
  );
}

function ThermalHeader({ table, customer, restaurant }: { table: string; customer: string; restaurant: Restaurant }) {
  return <header className="thermal-header"><div className="restaurant-symbol"><ShoppingBag size={17} /></div><h3>{restaurant.name}</h3><p>{restaurant.tagline}</p><p>{restaurant.address}</p><p>Ph: {restaurant.phone} · GSTIN {restaurant.gstin}</p><div className="receipt-meta"><span>BILL NO. BB-240918-078</span><span>18 SEP 2026 · {invoiceTime}</span><span>TABLE {table} · DINE-IN</span><span>GUEST: {customer.toUpperCase()}</span></div></header>;
}

function A4Header({ table, customer, restaurant }: { table: string; customer: string; restaurant: Restaurant }) {
  return <header className="a4-header"><div className="a4-brand-row"><div><div className="a4-logo"><span className="a4-logo-mark"><ShoppingBag size={20} /></span><span>{restaurant.name.toUpperCase()}</span></div><p>{restaurant.tagline} · {restaurant.address}</p><p>{restaurant.phone} · GSTIN {restaurant.gstin}</p></div><div className="tax-invoice-label"><span>TAX INVOICE</span><strong>BB-240918-078</strong></div></div><div className="a4-meta-grid"><div><span>Bill to</span><strong>{customer}</strong><small>Dine-in · Table {table}</small></div><div><span>Issued on</span><strong>{invoiceDate}</strong><small>{invoiceTime} IST</small></div><div><span>Order type</span><strong>Restaurant dining</strong><small>Cashier: Anika Kapoor</small></div></div></header>;
}

export default App;
