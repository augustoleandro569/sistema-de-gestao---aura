import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { SkeletonLoading } from '../../components/client/SkeletonLoading';
import { Redirect } from '../../components/common/Redirect';
import { FullCalendarComponent } from '../../components/client/FullCalendarComponent';

// src/pages/client/Booking.tsx
export const BookingPage = () => {
  const { userProfile, loading } = useAuth(); // Hook customizado de autenticação

  if (loading) return <SkeletonLoading />;

  // Se o cadastro não estiver completo, redireciona para a página de registro
  if (!userProfile?.registration_completed) {
    return <Redirect to="/portal/cadastro" />;
  }

  // Caso contrário, mostra a agenda
  return <FullCalendarComponent />;
};

export default BookingPage;
