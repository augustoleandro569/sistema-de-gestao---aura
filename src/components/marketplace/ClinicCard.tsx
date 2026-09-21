import React from 'react';
import {
  Star,
  MapPin,
  Sparkles,
  Users,
  Calendar,
  CheckCircle2,
  ExternalLink,
  Zap,
  ArrowRight
} from 'lucide-react';
import { Business } from '../../types';

interface ClinicCardProps {
  business: Business & {
    followersCount: number;
    isFollowed: boolean;
    distanceKm: number;
  };
  onFollowToggle: (businessId: string) => void;
  onBookClick: (businessId: string) => void;
  onViewClinic: (businessSlug: string) => void;
}

export const ClinicCard: React.FC<ClinicCardProps> = ({
  business,
  onFollowToggle,
  onBookClick,
  onViewClinic,
}) => {
  const isAds = !!business.isHighlightedAds;

  return (
    <div
      className={`group bg-white rounded-2xl border transition-all duration-300 overflow-hidden flex flex-col justify-between ${
        isAds
          ? 'border-amber-400 shadow-md ring-1 ring-amber-300/60 hover:shadow-lg'
          : 'border-stone-200 shadow-xs hover:shadow-md hover:border-stone-300'
      }`}
    >
      <div>
        {/* Cover / Header Image */}
        <div className="relative h-40 w-full overflow-hidden bg-stone-100">
          <img
            src={
              business.coverImage ||
              'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=600&q=80'
            }
            alt={business.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

          {/* Badges on Top */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 items-center">
            {isAds && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500 text-stone-950 text-[11px] font-extrabold shadow-sm tracking-wide uppercase">
                <Zap size={12} className="fill-stone-950" />
                {business.highlightBadge || 'Destaque Aura'}
              </span>
            )}
            <span className="inline-flex items-center gap-1 px-2.5 py-0.8 rounded-full bg-black/60 backdrop-blur-xs text-white text-[11px] font-medium">
              <MapPin size={11} className="text-amber-400" />
              {business.distanceKm ? `${business.distanceKm} km` : '1.2 km'}
            </span>
          </div>

          {/* Rating Badge on Top Right */}
          <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-full text-xs font-bold text-stone-900 flex items-center gap-1 shadow-sm">
            <Star size={13} className="text-amber-500 fill-amber-500" />
            <span>{business.rating ? business.rating.toFixed(1) : '4.9'}</span>
            <span className="text-[10px] text-stone-400 font-normal">
              ({business.reviewsCount || 120})
            </span>
          </div>

          {/* Business Logo & Name over cover gradient */}
          <div className="absolute bottom-3 left-3 right-3 flex items-end gap-3">
            <img
              src={business.logo || 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=150&q=80'}
              alt={business.name}
              className="w-13 h-13 rounded-xl object-cover border-2 border-white shadow-md ring-1 ring-black/10 shrink-0 bg-white"
              referrerPolicy="no-referrer"
            />
            <div className="text-white min-w-0">
              <h3 className="font-bold text-base text-white truncate drop-shadow-sm flex items-center gap-1">
                {business.name}
                <CheckCircle2 size={15} className="text-amber-400 fill-amber-400/20 shrink-0" />
              </h3>
              <p className="text-xs text-stone-200 truncate">
                {business.neighborhood || 'Jardins'}, {business.city || 'São Paulo'}
              </p>
            </div>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-4 space-y-3">
          {/* Description */}
          <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
            {business.description || 'Clínica especializada em estética avançada, visagismo e cuidados faciais com tecnologia de ponta.'}
          </p>

          {/* Specialties Pills */}
          {business.specialties && business.specialties.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {business.specialties.slice(0, 3).map((spec, i) => (
                <span
                  key={i}
                  className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-stone-100 text-stone-700"
                >
                  {spec}
                </span>
              ))}
              {business.specialties.length > 3 && (
                <span className="text-[11px] text-stone-400 font-medium px-1.5 py-0.5">
                  +{business.specialties.length - 3}
                </span>
              )}
            </div>
          )}

          {/* Social Stats: Followers */}
          <div className="flex items-center justify-between text-xs text-stone-500 pt-1">
            <div className="flex items-center gap-1.5 font-medium">
              <Users size={14} className="text-stone-400" />
              <span>{business.followersCount} seguidores</span>
            </div>

            <button
              type="button"
              onClick={() => onFollowToggle(business.id)}
              className={`text-xs font-semibold px-2.5 py-1 rounded-full transition-all cursor-pointer ${
                business.isFollowed
                  ? 'text-stone-700 bg-stone-100 hover:bg-stone-200'
                  : 'text-amber-700 bg-amber-50 hover:bg-amber-100'
              }`}
            >
              {business.isFollowed ? 'Seguindo' : '+ Seguir'}
            </button>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="p-4 pt-2 border-t border-stone-100 flex items-center gap-2 bg-stone-50/50">
        <button
          type="button"
          onClick={() => onViewClinic(business.slug)}
          className="flex-1 py-2 px-3 rounded-xl border border-stone-300 hover:border-stone-400 bg-white text-stone-700 text-xs font-bold transition-all hover:bg-stone-50 flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
        >
          <span>Ver Clínica</span>
          <ExternalLink size={13} className="text-stone-400" />
        </button>

        <button
          type="button"
          onClick={() => onBookClick(business.id)}
          className="flex-1 py-2 px-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <Calendar size={13} />
          <span>Agendar</span>
        </button>
      </div>
    </div>
  );
};
