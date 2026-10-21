
import { useState } from 'react';

interface Service {
  id: number;
  name: string;
  price: number;
}

interface ServiceItem {
  service: Service;
  quantity: number;
}

const availableServices: Service[] = [
  { id: 1, name: 'Разработка лендинга', price: 50000 },
  { id: 2, name: 'Интернет-магазин', price: 150000 },
  { id: 3, name: 'Корпоративный портал', price: 300000 },
  { id: 4, name: 'SEO-оптимизация', price: 20000 },
];

export default function App() {
  const [selectedServices, setSelectedServices] = useState<ServiceItem[]>([]);
  const [selectedServiceId, setSelectedServiceId] = useState<number | ''>('');
  const [quantity, setQuantity] = useState<number>(1);

  const totalPrice = selectedServices.reduce(
    (total, item) => total + item.service.price * item.quantity,
    0
  );

  function addService() {
    const service = availableServices.find(
      (s) => s.id === selectedServiceId
    );

    if (!service || quantity < 1 || quantity > 10) return;

    setSelectedServices((prev) => {
      const existing = prev.find(
        (item) => item.service.id === service.id
      );

      if (existing) {
        return prev.map((item) =>
          item.service.id === service.id
            ? {
              ...item,
              quantity: item.quantity + quantity,
            }
            : item
        );
      }

      return [...prev, { service, quantity }];
    });

    setSelectedServiceId('');
    setQuantity(1);
  }

  function removeService(serviceId: number) {
    setSelectedServices((prev) =>
      prev.filter((item) => item.service.id !== serviceId)
    );
  }

  const cellStyle: React.CSSProperties = {
    border: '1px solid #ddd',
    padding: 10,
    textAlign: 'left',
  };

  return (
    <div
      className="project-builder"
      style={{
        maxWidth: 700,
        margin: '40px auto',
        padding: 20,
        fontFamily: 'sans-serif',
      }}
    >
      <h2>Состав проекта</h2>

      <div
        className="add-service"
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 12,
          marginBottom: 24,
          alignItems: 'center',
        }}
      >
        <select
          value={selectedServiceId}
          onChange={(e) =>
            setSelectedServiceId(
              e.target.value === '' ? '' : Number(e.target.value)
            )
          }
          style={{ padding: '8px 12px', maxWidth: '100%' }}
        >
          <option value="" disabled>
            Выберите услугу
          </option>

          {availableServices.map((service) => (
            <option key={service.id} value={service.id}>
              {service.name} — {service.price.toLocaleString('ru-RU')} ₽
            </option>
          ))}
        </select>

        <input
          type="number"
          min={1}
          max={10}
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          style={{ width: 80, padding: '8px 12px' }}
        />

        <button
          onClick={addService}
          disabled={!selectedServiceId || quantity < 1 || quantity > 10}
        >
          Добавить
        </button>
      </div>

      {selectedServices.length > 0 ? (
        <table
          className="services-table"
          style={{ width: '100%', borderCollapse: 'collapse' }}
        >
          <thead>
            <tr>
              <th style={cellStyle}>Услуга</th>
              <th style={cellStyle}>Цена за ед.</th>
              <th style={cellStyle}>Кол-во</th>
              <th style={cellStyle}>Сумма</th>
              <th style={cellStyle}>Действие</th>
            </tr>
          </thead>

          <tbody>
            {selectedServices.map((item) => (
              <tr key={item.service.id}>
                <td style={cellStyle}>{item.service.name}</td>
                <td style={cellStyle}>
                  {item.service.price.toLocaleString('ru-RU')} ₽
                </td>
                <td style={cellStyle}>{item.quantity}</td>
                <td style={cellStyle}>
                  {(item.service.price * item.quantity).toLocaleString(
                    'ru-RU'
                  )}{' '}
                  ₽
                </td>
                <td style={cellStyle}>
                  <button onClick={() => removeService(item.service.id)}>
                    Удалить
                  </button>
                </td>
              </tr>
            ))}
          </tbody>

          <tfoot>
            <tr>
              <td colSpan={3} style={cellStyle}>
                <strong>Итого:</strong>
              </td>
              <td colSpan={2} style={cellStyle}>
                <strong>{totalPrice.toLocaleString('ru-RU')} ₽</strong>
              </td>
            </tr>
          </tfoot>
        </table>
      ) : (
        <p style={{ color: '#888', fontStyle: 'italic' }}>
          Пока не добавлено ни одной услуги
        </p>
      )}
    </div>
  );
}
