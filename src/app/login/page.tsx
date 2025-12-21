export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8">
        <h2 className="text-3xl font-bold text-center">Login to IG DM Tool</h2>
        <form className="space-y-4">
          <input 
            type="email" 
            placeholder="Email" 
            className="w-full p-3 border rounded-lg"
          />
          <input 
            type="password" 
            placeholder="Password" 
            className="w-full p-3 border rounded-lg"
          />
          <button 
            type="submit" 
            className="w-full bg-blue-600 text-white py-3 rounded-lg"
          >
            Sign In
          </button>
        </form>
        <p>Or continue with Instagram...</p>
      </div>
    </div>
  )
}
