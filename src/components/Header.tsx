import { BRAND_LOGO } from "../assets";

const Header = () => {
  return (
    <div className="w-full bg-secondary h-20 flex items-center justify-center">
      <img src={BRAND_LOGO} className="h-10" />
    </div>
  )
}

export default Header;