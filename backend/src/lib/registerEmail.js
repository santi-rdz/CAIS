export function registerEmail(email, url) {
  return `
<div style="max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05); font-family: Arial, sans-serif;">
  
  <!-- Header -->
  <div style="background: linear-gradient(135deg, #166534 0%, #15803d 100%); padding: 40px; text-align: center;">
    <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">
      ¡Bienvenido! 
    </h1>
  </div>
  
  <!-- Body -->
  <div style="padding: 40px;">
    <p style="margin: 0 0 20px; color: #1f2937; font-size: 16px; line-height: 1.6;">
      Hola <strong style="color: #166534;">${email.split('@')[0] || ''}</strong>,
    </p>
    
    <p style="margin: 0 0 30px; color: #4b5563; font-size: 16px; line-height: 1.6;">
      Haz clic en el siguiente botón para terminar tu registro:
    </p>
    
    <!-- Button -->
    <div style="text-align: center; margin: 30px 0;">
      <a href="${url}" style="display: inline-block; padding: 16px 40px; background-color: #166534; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(22, 101, 52, 0.3);">
        Realizar Registro →
      </a>
    </div>
    
    <!-- Info -->
    <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; border-left: 4px solid #166534; margin-top: 30px;">
      <p style="margin: 0; color: #374151; font-size: 14px; line-height: 1.5;">
        ⏰ Este enlace expira en 24 horas.
      </p>
    </div>
  </div>
  
  <!-- Footer -->
  <div style="padding: 30px 40px; background-color: #f9fafb; border-top: 1px solid #e5e7eb; text-align: center;">
    <p style="margin: 0; color: #9ca3af; font-size: 12px;">
      © ${new Date().getFullYear()} CAIS.
    </p>
  </div>
  
</div>
  `
}
