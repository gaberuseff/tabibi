import { Link } from "react-router-dom"
import LoginForm from "../features/auth/LoginForm"
import { Card } from "../components/ui/card"

export default function Login() {
  return (
    <div dir="rtl" className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            مرحباً بعودتك
          </h1>
          <p className="text-gray-600">سجل دخول إلى حسابك</p>
        </div>

        <LoginForm />

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            ليس لديك حساب؟{" "}
            <Link
              to="/signup"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              إنشاء حساب
            </Link>
          </p>
        </div>
      </Card>
    </div>
  )
}
