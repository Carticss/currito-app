import React from 'react';
import './styles/SettingsPage.css';
import { HiLocationMarker, HiPhone, HiMail, HiGlobe, HiLink } from 'react-icons/hi';
import { useOrganization } from './hooks/useSettings';

export const SettingsPage: React.FC = () => {
    const { organization, loading } = useOrganization();

    if (loading || !organization) {
        return <div className="settings-loading">Cargando configuración...</div>;
    }

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase();
    };

    return (
        <div className="settings-container">

            <h1 className="settings-title">Configuración de Organización</h1>

            <div className="settings-card">
                <h2 className="settings-card-title">Identidad de la Organización</h2>

                <div className="settings-identity">
                    <div className="settings-logo">
                        {getInitials(organization.name)}
                    </div>

                    <div className="settings-identity-fields">
                        <label>Nombre de la Organización</label>
                        <input disabled value={organization.name} />

                        <label>Descripción</label>
                        <textarea disabled value={organization.description} />
                    </div>
                </div>
            </div>

            <div className="settings-card">
                <h2 className="settings-card-title">Información de Contacto</h2>

                <div className="settings-contact-grid">

                    <div className="settings-input-group">
                        <label>Dirección</label>
                        <div className="settings-input-icon">
                            <HiLocationMarker />
                            <input disabled value={organization.address} />
                        </div>
                    </div>

                    <div className="settings-input-group">
                        <label>Número de Teléfono</label>
                        <div className="settings-input-icon">
                            <HiPhone />
                            <input disabled value={organization.phone} />
                        </div>
                    </div>

                    <div className="settings-input-group">
                        <label>Correo Electrónico</label>
                        <div className="settings-input-icon">
                            <HiMail />
                            <input disabled value={organization.email} />
                        </div>
                    </div>

                    <div className="settings-input-group">
                        <label>Sitio Web</label>
                        <div className="settings-input-icon">
                            <HiGlobe />
                            <input disabled value={organization.website} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="settings-card">
                <h2 className="settings-card-title">Perfiles Sociales</h2>

                {organization.socialLinks.map((link, index) => (
                    <div key={index} className="settings-social-row">
                        <div className="settings-input-icon">
                            <HiLink />
                            <input disabled value={link} />
                        </div>
                    </div>
                ))}

                <button className="settings-add-btn" disabled>
                    + Agregar enlace social
                </button>
            </div>
        </div>
    );
};
