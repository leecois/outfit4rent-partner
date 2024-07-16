import { useConfigProvider } from '../../context';

type ILogoProps = {
  xl?: boolean;
  white?: boolean;
  theme?: string;
};

const Logo = (props: ILogoProps) => {
  const { mode } = useConfigProvider();
  const isDarkMode = mode === 'dark';
  const size = props.xl ? '44px' : '32px';
  const fontSize = props.xl ? '1.5em' : '1em';
  const fontWeight = 'bold';
  const color = props.white ? '#f8f9fa' : '#212529';
  const logoSource = isDarkMode
    ? '/images/logo-mark-darkmode.png'
    : '/images/logo-mark-light.svg';

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        color,
        fontSize,
        fontWeight,
        position: 'relative',
      }}
    >
      <img width={size} height={size} src={logoSource} alt="logo" />
    </span>
  );
};

export { Logo };
