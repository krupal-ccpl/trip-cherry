import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  Input,
  Checkbox,
  Button,
  Typography,
} from "@material-tailwind/react";

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      return;
    }
    // Mock login - just navigate to dashboard
    navigate('/dashboard/bookings');
  };

  return (
    <section className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 p-4">
      <Card color="white" shadow={true} className="p-8 w-full max-w-md" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
        <div className="text-center mb-6">
          <Typography variant="h2" className="font-bold mb-2" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
            Trip Cherry
          </Typography>
          <Typography color="gray" className="font-normal" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
            Sign in to your account
          </Typography>
        </div>
        <form onSubmit={handleSignIn} className="space-y-6">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Your email <span className="text-red-500">*</span>
            </label>
            <Input
              size="lg"
              type="email"
              placeholder="Enter your email"
              className="!border-t-blue-gray-200 focus:!border-t-gray-900"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              crossOrigin={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Password <span className="text-red-500">*</span>
            </label>
            <Input
              size="lg"
              type="password"
              placeholder="Enter your password"
              className="!border-t-blue-gray-200 focus:!border-t-gray-900"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              crossOrigin={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            />
          </div>
          <div className="flex items-center justify-between">
            <Checkbox
              label={
                <Typography color="gray" className="font-normal" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                  Remember Me
                </Typography>
              }
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
              crossOrigin={undefined}
            />
            <Typography variant="small" className="font-medium text-gray-900" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
              <a href="#">
                Forgot Password
              </a>
            </Typography>
          </div>
          <Button
            type="submit"
            className="w-full"
            color="blue"
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          >
            Sign In
          </Button>
        </form>
      </Card>
    </section>
  );
}
