
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const Dashboard = () => {
  const features = [
    {
      title: 'Productos e inventarios',
      description: 'Gestiona tu catálogo de productos y controla el stock en tiempo real',
      gradient: 'from-blue-500 to-blue-600',
      textColor: 'text-white',
    },
    {
      title: 'Gestión de compras y ventas',
      description: 'Administra todas tus operaciones comerciales desde un solo lugar',
      gradient: 'from-indigo-500 to-indigo-600',
      textColor: 'text-white',
    },
    {
      title: 'Control de stock',
      description: 'Monitorea existencias y recibe alertas automáticas de stock bajo',
      gradient: 'from-purple-500 to-purple-600',
      textColor: 'text-white',
    },
    {
      title: 'Sitio Web Ecommerce',
      description: 'Crea tu tienda online integrada con tu sistema de gestión',
      gradient: 'from-pink-500 to-pink-600',
      textColor: 'text-white',
    },
    {
      title: 'Panel de clientes',
      description: 'Gestiona información de clientes y historial de compras',
      gradient: 'from-green-500 to-green-600',
      textColor: 'text-white',
    },
    {
      title: 'Administración y finanzas',
      description: 'Controla la contabilidad y genera reportes financieros',
      gradient: 'from-orange-500 to-orange-600',
      textColor: 'text-white',
    },
  ];

  return (
    <div className="p-6 space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 p-8 text-white tech-pattern">
        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Potencia tu empresa con
          </h1>
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-blue-100">
            nuestra solución integral
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl">
            Sistema completo de gestión empresarial que te ayuda a optimizar 
            todos los procesos de tu negocio desde una plataforma unificada.
          </p>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-xl float-animation"></div>
        <div className="absolute bottom-10 right-20 w-24 h-24 bg-white/5 rounded-full blur-lg float-animation" style={{animationDelay: '2s'}}></div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <Card 
            key={index} 
            className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-90`}></div>
            <CardHeader className="relative z-10">
              <CardTitle className={`text-lg font-bold ${feature.textColor}`}>
                {feature.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="relative z-10">
              <p className={`${feature.textColor} opacity-90 mb-4 text-sm`}>
                {feature.description}
              </p>
              <Button 
                variant="secondary" 
                size="sm"
                className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm transition-all duration-200"
              >
                Explorar
              </Button>
            </CardContent>
            
            {/* Decorative corner */}
            <div className="absolute -top-4 -right-4 w-16 h-16 bg-white/10 rounded-full group-hover:scale-110 transition-transform duration-300"></div>
          </Card>
        ))}
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Productos Activos', value: '1,234', change: '+12%' },
          { label: 'Ventas del Mes', value: '$45,678', change: '+8%' },
          { label: 'Clientes Totales', value: '856', change: '+15%' },
          { label: 'Stock Bajo', value: '23', change: '-5%' },
        ].map((stat, index) => (
          <Card key={index} className="bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`text-sm font-medium ${
                  stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.change}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
