import { StudentListUser } from '@/components/common/student-list';
import { useEffect, useRef, useState } from 'react';
import { StudentMapData, StudentMapService } from '../services/StudentMapService';

interface SelectedLocation {
    name: string;
    type: 'country' | 'state' | 'city';
    users: StudentListUser[];
}

const getInitialZoom = (): number => {
    if (window.innerWidth < 768) {
        return 3;
    }
    return 5;
};

export const useStudentMap = (students: StudentMapData[]) => {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapServiceRef = useRef<StudentMapService | null>(null);
    const [selectedLocation, setSelectedLocation] = useState<SelectedLocation | null>(null);
    const [isMapInitialized, setIsMapInitialized] = useState(false);

    // Efeito para carregar o Leaflet dinamicamente
    useEffect(() => {
        const loadLeaflet = async () => {
            try {
                // Importar o CSS do Leaflet
                await import('leaflet/dist/leaflet.css');
                setIsMapInitialized(true);
            } catch (error) {
                console.error('❌ Erro ao carregar Leaflet:', error);
            }
        };

        loadLeaflet();
    }, []);

    // Efeito para inicializar o mapa após o Leaflet estar carregado
    useEffect(() => {
        if (!isMapInitialized || !mapRef.current || !students || !Array.isArray(students) || students.length === 0) {
            return;
        }

        const initializeMap = async () => {
            try {
                if (!mapServiceRef.current) {
                    mapServiceRef.current = new StudentMapService(students, getInitialZoom());
                    await mapServiceRef.current.initialize(mapRef.current!);

                    // Configurar os eventos de clique para cada tipo de localização
                    mapServiceRef.current.onLocationClick(
                        (location: string, type: 'country' | 'state' | 'city', locationData: StudentMapData) => {
                            // Transformar os dados dos estudantes para o formato esperado pelo StudentList
                            const users: StudentListUser[] = locationData.students.map((student) => ({
                                id: student.id,
                                name: student.name,
                                image: student.profile.image || '',
                                points: student.profile.points || 0,
                                streaks: student.profile.streaks || 0,
                                active_frame_id: student.profile.active_frame_id,
                                frame: student.profile.frame,
                                badgesCount: student.profile.badges_count || 0,
                                activeOffensives: student.profile.active_offensives || []
                            }));

                            setSelectedLocation({
                                name: location,
                                type,
                                users
                            });
                        }
                    );
                }
            } catch (error) {
                console.error('❌ Erro ao inicializar o mapa:', error);
            }
        };

        initializeMap();

        return () => {
            if (mapServiceRef.current) {
                mapServiceRef.current = null;
            }
            setSelectedLocation(null);
        };
    }, [isMapInitialized, students]);

    return { mapRef, selectedLocation, setSelectedLocation };
};
