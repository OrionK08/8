import { useState, useEffect, useRef } from 'react'
import './App.css'

// Añadimos estilos para las animaciones del mensaje secreto
const estilosCSS = `
  @keyframes latido {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.1); }
  }
  
  @keyframes pulso {
    0% { opacity: 0.2; }
    50% { opacity: 0.4; }
    100% { opacity: 0.2; }
  }
  
  .animate-latido {
    animation: latido 1.5s infinite ease-in-out;
  }
  
  .animate-pulso {
    animation: pulso 3s infinite ease-in-out;
  }
  
  .efecto-hover:hover {
    opacity: 1 !important;
    transform: translateY(0) scale(1) !important;
  }

  .lighthouse-base {
    background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%);
    box-shadow: 
      inset -20px 0 40px rgba(0,0,0,0.2),
      inset 20px 0 40px rgba(255,255,255,0.1);
  }

  .red-stripe {
    background: linear-gradient(135deg, #dc2626 0%, #b91c1c 50%, #991b1b 100%);
    box-shadow: 
      inset -5px 0 10px rgba(0,0,0,0.3),
      inset 5px 0 10px rgba(255,255,255,0.1);
  }

  .lighthouse-roof {
    background: linear-gradient(135deg, #7f1d1d 0%, #991b1b 50%, #b91c1c 100%);
    clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
    box-shadow: 
      0 -10px 20px rgba(0,0,0,0.4),
      inset -10px 0 20px rgba(0,0,0,0.2);
  }

  .depth-shadow {
    box-shadow: 0 0 0 2px rgba(0,0,0,0.1), 0 20px 40px rgba(0,0,0,0.3);
  }
`

function App() {
  const lightBeamRef = useRef(null);
  const lightEffectRef = useRef(null);
  const customCursorRef = useRef(null);
  const starsContainerRef = useRef(null);
  const cloudsContainerRef = useRef(null);
  const lighthouseRef = useRef(null);
  
  // Referencias para las tres estrellas especiales en el cielo
  const estrellaEspecial1Ref = useRef(null);
  const estrellaEspecial2Ref = useRef(null);
  const estrellaEspecial3Ref = useRef(null);
  
  // Referencias para los mensajes secretos
  const mensajeSecreto1Ref = useRef(null);
  const mensajeSecreto2Ref = useRef(null);
  const mensajeSecreto3Ref = useRef(null);
  
  // Estados para controlar la visibilidad de los mensajes con valores iniciales explícitamente falsos
  const [mostrarMensaje1, setMostrarMensaje1] = useState(false);
  const [mostrarMensaje2, setMostrarMensaje2] = useState(false);
  const [mostrarMensaje3, setMostrarMensaje3] = useState(false);
  
  // Asegurarnos de que los mensajes estén ocultos al cargar
  useEffect(() => {
    setMostrarMensaje1(false);
    setMostrarMensaje2(false);
    setMostrarMensaje3(false);
  }, []);
  
  // Referencia para los timeouts
  const cursorTimeoutRef = useRef(null);

  useEffect(() => {
    // Añadir los estilos CSS para las animaciones
    const styleElement = document.createElement('style');
    styleElement.textContent = estilosCSS;
    document.head.appendChild(styleElement);
    
    // Configurar el efecto hover para las estrellas especiales en el cielo
    const configurarEstrellaEspecial = (estrellaRef, setMostrarMensaje) => {
      const estrellaElement = estrellaRef.current;
      if (estrellaElement) {
        estrellaElement.addEventListener('mouseenter', () => {
          if (cursorTimeoutRef.current) clearTimeout(cursorTimeoutRef.current);
          cursorTimeoutRef.current = setTimeout(() => {
            setMostrarMensaje(true);
          }, 1000);
        });
        
        estrellaElement.addEventListener('mouseleave', () => {
          if (cursorTimeoutRef.current) clearTimeout(cursorTimeoutRef.current);
          setMostrarMensaje(false);
        });
      }
    };
    
    // Configurar cada estrella especial con su respectivo mensaje
    configurarEstrellaEspecial(estrellaEspecial1Ref, setMostrarMensaje1);
    configurarEstrellaEspecial(estrellaEspecial2Ref, setMostrarMensaje2);
    configurarEstrellaEspecial(estrellaEspecial3Ref, setMostrarMensaje3);
    // Crear estrellas
    const starsContainer = starsContainerRef.current;
    for (let i = 0; i < 200; i++) {
      const star = document.createElement('div');
      star.className = 'star';
      const size = Math.random() * 3 + 1;
      star.style.left = `${Math.random() * 100}%`;
      star.style.top = `${Math.random() * 70}%`;
      star.style.width = `${size}px`;
      star.style.height = `${size}px`;
      star.style.opacity = Math.random() * 0.7 + 0.3;
      star.style.setProperty('--delay', Math.random() * 5);
      starsContainer.appendChild(star);
    }

    // Crear 5 nubes con movimientos más lentos
    const cloudsContainer = cloudsContainerRef.current;
    // Definir posiciones específicas para las 5 nubes
    const cloudPositions = [
      { left: '15%', top: '12%', width: '110px', height: '30px', delay: 0.5 },
      { left: '35%', top: '4%', width: '130px', height: '35px', delay: 1.2 },
      { left: '55%', top: '10%', width: '110px', height: '28px', delay: 0.8 },
      { left: '75%', top: '6%', width: '130px', height: '32px', delay: 1.5 },
      { left: '90%', top: '15%', width: '95px', height: '26px', delay: 0.3 }
    ];
    
    cloudPositions.forEach(pos => {
      const cloud = document.createElement('div');
      cloud.className = 'cloud';
      cloud.style.left = pos.left;
      cloud.style.top = pos.top;
      cloud.style.width = pos.width;
      cloud.style.height = pos.height;
      cloud.style.setProperty('--delay', pos.delay);
      cloudsContainer.appendChild(cloud);
    });

    const getLighthousePosition = () => {
      const rect = lighthouseRef.current.getBoundingClientRect();
      return {
        x: rect.left + rect.width / 2,
        y: rect.top + 55 // Ajustado para que el haz salga de la parte superior del faro
      };
    };

    const handleMouseMove = (e) => {
      const mouseX = e.clientX;
      const mouseY = e.clientY;
      const lighthousePos = getLighthousePosition();

      customCursorRef.current.style.left = `${mouseX}px`;
      customCursorRef.current.style.top = `${mouseY}px`;

      const deltaX = mouseX - lighthousePos.x;
      const deltaY = mouseY - lighthousePos.y;
      const angle = Math.atan2(deltaY, deltaX) * 180 / Math.PI;

      lightBeamRef.current.style.transform = `rotate(${angle - 90}deg)`;
      lightBeamRef.current.style.left = `${lighthousePos.x}px`;
      lightBeamRef.current.style.top = `${lighthousePos.y}px`;

      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      const maxDistance = Math.sqrt(window.innerWidth ** 2 + window.innerHeight ** 2);
      const intensity = Math.max(0.2, 1 - distance / maxDistance);
      const size = Math.min(400, distance * 0.5 + 100);

      lightEffectRef.current.style.width = `${size}px`;
      lightEffectRef.current.style.height = `${size}px`;
      lightEffectRef.current.style.left = `${mouseX}px`;
      lightEffectRef.current.style.top = `${mouseY}px`;
      lightEffectRef.current.style.transform = `translate(-50%, -50%)`;
      lightEffectRef.current.style.opacity = intensity;
    };

    const handleMouseLeave = () => {
      customCursorRef.current.style.opacity = '0';
      lightEffectRef.current.style.opacity = '0';
      lightBeamRef.current.style.opacity = '0';
    };

    const handleMouseEnter = () => {
      customCursorRef.current.style.opacity = '1';
      lightEffectRef.current.style.opacity = '1';
      lightBeamRef.current.style.opacity = '1';
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    const initialPos = getLighthousePosition();
    lightBeamRef.current.style.left = `${initialPos.x}px`;
    lightBeamRef.current.style.top = `${initialPos.y}px`;

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      
      // Limpiar el timeout y los estilos añadidos
      if (cursorTimeoutRef.current) {
        clearTimeout(cursorTimeoutRef.current);
      }
      
      // Limpiar los event listeners de las estrellas especiales
      const limpiarEventListeners = (estrellaRef) => {
        const estrellaElement = estrellaRef.current;
        if (estrellaElement) {
          estrellaElement.replaceWith(estrellaElement.cloneNode(true));
        }
      };
      
      limpiarEventListeners(estrellaEspecial1Ref);
      limpiarEventListeners(estrellaEspecial2Ref);
      limpiarEventListeners(estrellaEspecial3Ref);
      
      const styleElement = document.querySelector('style');
      if (styleElement) {
        document.head.removeChild(styleElement);
      }
    };
  }, []);

  return (
    <div className="bg-gradient-to-b from-gray-900 to-black h-screen overflow-hidden relative cursor-none">
      <div id="customCursor" ref={customCursorRef} className="cursor-light"></div>

      <div className="h-full w-full flex flex-col items-center justify-end relative">

        <div id="stars" ref={starsContainerRef} className="absolute inset-0 pointer-events-none"></div>
        <div id="clouds" ref={cloudsContainerRef} className="absolute inset-0 pointer-events-none"></div>
        
        {/* Estrella especial #1 en el cielo con interacción 
            Para cambiar el tamaño de las estrellas, modifica los valores de w-12 y h-12 
            Ejemplos: 
            - Más pequeña: w-8 h-8
            - Más grande: w-16 h-16
            - Tamaño personalizado: w-[50px] h-[50px]
        */}
        <div 
          ref={estrellaEspecial1Ref} 
          className="absolute top-[15%] left-[25%] z-10 w-8 h-8 flex items-center justify-center animate-latido"
        >
          <div className="star-special w-1 h-1 bg-white rounded-full shadow-[0_0_15px_5px_rgba(255,255,255,0.6)]">
            <div className="absolute inset-0 star-shape bg-white"></div>
          </div>
        </div>
        
        {/* Estrella especial #2 en el cielo con interacción */}
        <div 
          ref={estrellaEspecial2Ref} 
          className="absolute top-[30%] left-[60%] z-10 w-8 h-8 flex items-center justify-center animate-latido"
        >
          <div className="star-special w-1 h-1 bg-white rounded-full shadow-[0_0_15px_5px_rgba(255,255,255,0.6)]">
            <div className="absolute inset-0 star-shape bg-white"></div>
          </div>
        </div>
        
        {/* Estrella especial #3 en el cielo con interacción */}
        <div 
          ref={estrellaEspecial3Ref} 
          className="absolute top-[10%] left-[80%] z-10 w-8 h-8 flex items-center justify-center animate-latido"
        >
          <div className="star-special w-1 h-1 bg-white rounded-full shadow-[0_0_15px_5px_rgba(255,255,255,0.6)]">
            <div className="absolute inset-0 star-shape bg-white"></div>
          </div>
        </div>
        
        {/* Mensaje secreto 1 */}
        <div 
          id="mensaje-secreto-1" 
          ref={mensajeSecreto1Ref}
          className={`mensaje-secreto-1 fixed top-8 right-8 text-white py-8 px-10 rounded-3xl text-xl font-medium max-w-sm text-center z-[2000] ${mostrarMensaje1 ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-5 scale-90 hidden'} pointer-events-none transition-all duration-1000 efecto-hover`}
        >
          <div className="text-5xl mb-4 animate-latido">🌍</div>
          <p className="leading-relaxed">Eres mi geografía favorita, el lugar donde mis pasos encuentran sentido. 
            En estos ocho meses he descubierto que el amor no es solo mirarse, sino mirar juntos hacia la misma estrella y 
            saber que estamos construyendo algo eterno.
          </p>
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 to-amber-600/20 rounded-3xl animate-pulso"></div>
        </div>
        
        {/* Mensaje secreto 2 */}
        <div 
          id="mensaje-secreto-2" 
          ref={mensajeSecreto2Ref}
          className={`mensaje-secreto-1 fixed top-8 left-8 text-white py-8 px-10 rounded-3xl text-xl font-medium max-w-sm text-center z-[2000] ${mostrarMensaje2 ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-5 scale-90 hidden'} pointer-events-none transition-all duration-1000 efecto-hover`}
        >
          <div className="text-5xl mb-4 animate-latido">❤️‍🔥</div>
          <p className="leading-relaxed">Como la luz que emerge de esta torre en la noche, tú iluminas cada rincón de mi existencia. 
            Eres la palabra que faltaba en mi verso, la melodía que mi corazón esperaba componer. 
            En estos meses has logrado que cada amanecer sea una promesa nueva.
            </p>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-600/20 rounded-3xl animate-pulso"></div>
        </div>
        
        {/* Mensaje secreto 3 */}
        <div 
          id="mensaje-secreto-3" 
          ref={mensajeSecreto3Ref}
          className={`mensaje-secreto-1 fixed bottom-8 right-8 text-white py-8 px-10 rounded-3xl text-xl font-medium max-w-sm text-center z-[2000] ${mostrarMensaje3 ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-5 scale-90 hidden'} pointer-events-none transition-all duration-1000 efecto-hover`}
        >
          <div className="text-5xl mb-4 animate-latido">🔥</div>
          <p className="leading-relaxed">Si pudiera detener el tiempo, elegiría los momentos que hacemos el amor y repertirlo una y otra vez.
            Eres mi refugio en la tormenta,mi aventura en la calma, mi hogar en cualquier lugar del mundo. 
            Ocho meses que se sienten como el comienzo de nuestra historia infinita.
          </p>
          <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-orange-600/20 rounded-3xl animate-pulso"></div>
        </div>

        <div
          className="absolute top-10 right-10 w-20 h-20 rounded-full bg-gradient-to-br from-amber-100 to-amber-200 shadow-[0_0_40px_15px_rgba(255,255,200,0.4)]">
        </div>

        <div id="lightBeam" ref={lightBeamRef} className="light-beam absolute pointer-events-none z-10"></div>

        {/* FARO */}
        <div className="relative z-20 mb-0" id="lighthouse" ref={lighthouseRef}>
          {/* Techo del faro */}
          <div className="lighthouse-roof relative w-12 h-10 mx-auto">
            {/* Veleta en la punta */}
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-0.5 h-4 bg-gray-400"></div>
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-2 h-1.5 bg-gray-400 rounded-full"></div>
          </div>

          {/* Luz potente */}
          <div className="lighthouse-light w-8 h-8 bg-amber-300 rounded-full mx-auto -mt-3 z-30 relative shadow-[0_0_25px_8px_rgba(255,204,0,0.6)]">
            <div className="absolute inset-1.5 bg-amber-100 rounded-full"></div>
            <div className="absolute inset-2.5 bg-white rounded-full"></div>
          </div>

          {/* Base del faro */}
          <div className="lighthouse-base relative w-20 h-40 mx-auto -mt-1 rounded-lg overflow-hidden depth-shadow" style={{clipPath: 'polygon(30% 0%, 70% 0%, 85% 100%, 15% 100%)'}}>
            {/* Franjas rojas */}
            <div className="red-stripe absolute w-full h-8 top-8"></div>
            <div className="red-stripe absolute w-full h-8 top-20"></div>
            <div className="red-stripe absolute w-full h-8 top-32"></div>
            
            {/* Ventanas */}
            <div className="absolute top-12 left-1/2 transform -translate-x-1/2 w-3 h-5 bg-gray-800 rounded-t-lg border border-gray-600"></div>
            <div className="absolute top-24 left-1/2 transform -translate-x-1/2 w-3 h-5 bg-gray-800 rounded-t-lg border border-gray-600"></div>
            
            {/* Puerta */}
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-8 bg-gray-800 rounded-t-lg border-2 border-gray-600">
              <div className="w-0.5 h-0.5 bg-yellow-400 rounded-full absolute top-4 right-0.5"></div>
            </div>

            {/* Barandilla superior */}
            <div className="absolute -top-2 w-full">
              <div className="h-1 w-full bg-gray-700 rounded-full"></div>
              <div className="flex justify-around absolute -top-2 w-full">
                <div className="w-0.5 h-3 bg-gray-600"></div>
                <div className="w-0.5 h-3 bg-gray-600"></div>
                <div className="w-0.5 h-3 bg-gray-600"></div>
                <div className="w-0.5 h-3 bg-gray-600"></div>
                <div className="w-0.5 h-3 bg-gray-600"></div>
              </div>
            </div>
          </div>

          {/* Reflejo del faro */}
          <div className="absolute w-full h-full top-full rotate-180 opacity-20 scale-y-75">
            <div className="lighthouse-base relative w-16 h-40 mx-auto rounded-lg overflow-hidden blur-sm">
              <div className="red-stripe absolute w-full h-8 top-8"></div>
              <div className="red-stripe absolute w-full h-8 top-20"></div>
              <div className="red-stripe absolute w-full h-8 top-32"></div>
            </div>
          </div>

          {/* Base rocosa */}
          <div className="w-40 h-16 mx-auto flex justify-center items-end gap-1 relative -mt-10">
            {/* Plataforma principal */}
            <div className="absolute bottom-0 w-36 h-8 bg-gray-800 rounded-t-lg shadow-inner"></div>
            
            {/* Rocas decorativas */}
            <div className="w-5 h-5 bg-gray-700 rotate-[15deg] rounded-sm absolute bottom-6 left-2"></div>
            <div className="w-7 h-7 bg-gray-600 rotate-[10deg] rounded-md absolute bottom-7 left-8"></div>
            <div className="w-6 h-6 bg-gray-800 rotate-[25deg] rounded-sm absolute bottom-6 left-16"></div>
            <div className="w-8 h-8 bg-gray-700 rotate-[30deg] rounded-md absolute bottom-7 left-24"></div>
            <div className="w-5 h-5 bg-gray-600 rotate-[-15deg] rounded-sm absolute bottom-6 left-32"></div>
            
            {/* Detalles de la plataforma */}
            <div className="absolute bottom-2 left-4 w-28 h-2 bg-gray-900 rounded-full opacity-50"></div>
            <div className="absolute bottom-4 left-8 w-20 h-1 bg-gray-900 rounded-full opacity-30"></div>
          </div>
        </div>

        <div id="lightEffect" ref={lightEffectRef} className="light-effect absolute rounded-full pointer-events-none z-15"></div>
        <div className="water w-full h-32 absolute bottom-0 z-10"></div>
      </div>
    </div>
  )
}

export default App