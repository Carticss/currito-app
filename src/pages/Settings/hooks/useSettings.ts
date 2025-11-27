import { useEffect, useState } from 'react';
import { OrganizationRepository, type OrganizationResponse } from '../repository/SettingsRepository';


export const useOrganization = () => {
    const [organization, setOrganization] = useState<OrganizationResponse | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await OrganizationRepository.getOrganization();
                setOrganization(data);
            } catch (error) {
                console.error("Error loading organization:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return {
        organization,
        loading
    };
};
