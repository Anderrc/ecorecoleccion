import React from 'react';

const Login = () => {
	return (
		<main className="min-h-screen flex items-center justify-center relative">
			<div
  				className="absolute inset-0 bg-cover bg-center filter blur-none"
 				style={{
    			backgroundImage:
     			 "url('https://images.unsplash.com/photo-1719153863464-b2ee7e28b6df?q=80&w=1169&auto=format&fit=crop')",
  				}}
				></div>
				<div className="absolute inset-0 bg-green-800/20"></div>
				
				<section className="bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-lg w-full max-w-sm relative z-10">
				
				<header className="mb-6 text-center">
					
					<svg
						className="mx-auto mb-3 w-10 h-10 text-green-500"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						viewBox="0 0 30 30"
					>
						<path
						strokeLinecap="round"
						strokeLinejoin="round"
						d="m20.893 13.393-1.135-1.135a2.252 2.252 0 0 1-.421-.585l-1.08-2.16a.414.414 0 0 0-.663-.107.827.827 0 0 1-.812.21l-1.273-.363a.89.89 0 0 0-.738 1.595l.587.39c.59.395.674 1.23.172 1.732l-.2.2c-.212.212-.33.498-.33.796v.41c0 .409-.11.809-.32 1.158l-1.315 2.191a2.11 2.11 0 0 1-1.81 1.025 1.055 1.055 0 0 1-1.055-1.055v-1.172c0-.92-.56-1.747-1.414-2.089l-.655-.261a2.25 2.25 0 0 1-1.383-2.46l.007-.042a2.25 2.25 0 0 1 .29-.787l.09-.15a2.25 2.25 0 0 1 2.37-1.048l1.178.236a1.125 1.125 0 0 0 1.302-.795l.208-.73a1.125 1.125 0 0 0-.578-1.315l-.665-.332-.091.091a2.25 2.25 0 0 1-1.591.659h-.18c-.249 0-.487.1-.662.274a.931.931 0 0 1-1.458-1.137l1.411-2.353a2.25 2.25 0 0 0 .286-.76m11.928 9.869A9 9 0 0 0 8.965 3.525m11.928 9.868A9 9 0 1 1 8.965 3.525"
						/>
					</svg>

					<h1 className="text-2xl font-bold text-green-700">EcoRecolección</h1>
					<h2 className="mt-6 mb-6 text-2xl font-bold text-green-700">
						Iniciar sesión
					</h2>
					<p className="text-sm text-gray-600">
						Accede para contribuir al manejo de desechos responsable
					</p>
					</header>
					<form>
						<div className="mb-4">
							<label
							htmlFor="email"
							className="block text-gray-700 font-medium mb-1"
							>
							Correo
							</label>
							<input
							id="email"
							type="email"
							placeholder="ejemplo@correo.com"
							className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
							/>
						</div>
						<div className="mb-4">
							<label
								htmlFor="password"
								className="block text-gray-700 font-medium mb-1"
							>
								Contraseña
							</label>
							<input
								id="password"
								type="password"
								placeholder="••••••••"
								className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
							/>
						</div>
						<button
							type="submit"
							className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition duration-300"
							>
							Entrar
						</button>
						<footer className="text-center text-sm text-gray-500 mt-4">
							¿No tienes cuenta?{" "}
							<a href="#" className="text-green-500 hover:underline">
								Regístrate
							</a>
						</footer>



					</form>

				</section>


				


		</main>
	);
};

export default Login;
