import React from "react";

const AvisoDePrivacidad: React.FC = () => (
  <div style={{ maxWidth: 600, margin: "0 auto", padding: 24 }}>
    <h2>Aviso de Privacidad</h2>
    <p>
      De conformidad con lo establecido en la Ley Federal de Protección de Datos Personales en Posesión de los Particulares, el Dr. Walfred Rueda (en adelante, “el Responsable”), con domicilio en Ciudad de México, hace de su conocimiento lo siguiente:
    </p>
    <ul>
      <li><strong>Datos personales recabados:</strong> nombre, edad, teléfono, correo electrónico y en su caso información clínica necesaria para la prestación de los servicios médicos.</li>
      <li><strong>Finalidad:</strong> sus datos se utilizan exclusivamente para agendar y dar seguimiento a consultas médicas, contacto para recordatorios, envío de información relacionada con los servicios, así como para fines administrativos y de facturación.</li>
      <li><strong>Transferencia de datos:</strong> no se comparten sus datos con terceros ajenos, salvo obligación legal o requerimiento de autoridad competente.</li>
      <li><strong>Seguridad:</strong> se aplican medidas técnicas, administrativas y físicas para proteger su información.</li>
      <li><strong>Derechos ARCO:</strong> usted puede ejercer en cualquier momento sus derechos de acceso, rectificación, cancelación u oposición de sus datos, o revocar el consentimiento otorgado, escribiendo al correo: <a href="mailto:contacto@walfredrueda.com">contacto@walfredrueda.com</a></li>
      <li><strong>Modificaciones:</strong> cualquier cambio a este aviso será publicado en el presente sitio web.</li>
    </ul>
    <h3>Agradecimientos</h3>
    <ul>
      <li>
        Iconos de psicología por{' '}
        <a href="https://www.flaticon.es/iconos-gratis/psicologia" target="_blank" rel="noopener noreferrer" title="psicología iconos">
          kerismaker - Flaticon
        </a>.
      </li>
    </ul>
  </div>
);

export default AvisoDePrivacidad;
