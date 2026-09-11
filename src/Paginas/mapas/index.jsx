import Mapa from '../../components/mapassegundaparte/componente1'
import { useAuth } from '../../auth/AuthContext'


export default function Legajos() {

  const { logout } = useAuth();

    return (

      <div>

        <button
          onClick={() => logout()}
          style={{
            position: 'fixed',
            top: 12,
            right: 12,
            zIndex: 1200,
            padding: '8px 16px',
            borderRadius: 10,
            border: 'none',
            cursor: 'pointer',
            fontWeight: 700,
            fontSize: 13,
            color: '#fff',
            background: 'linear-gradient(135deg, #0B3546, #072637)',
            boxShadow: '0 4px 14px rgba(11,53,70,0.35)',
          }}
        >
          Cerrar sesión
        </button>

<Mapa/>
  </div>

    );

}
