import { LOADER } from "../assets";

interface Props {
  text: string,
  onClick?: () => void,
  disabled?: boolean,
  loading?: boolean
}

const Button: React.FC<Props> = ({ onClick = () => { }, text, disabled = false, loading = false }) => {
  return (
    <button onClick={() => onClick()} type="submit" disabled={disabled}
      className={`w-full px-5 py-3 text-sm text-center flex items-center justify-center ${disabled ? "bg-disabled text-[#807C7C]" : "bg-primary text-white "}`}>
      {loading ? <img src={LOADER} /> : text}
    </button>
  )
}

export default Button;