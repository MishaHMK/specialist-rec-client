export interface IRecommendation{
    therapist: {
        id: number;
        introduction: string;
        specialityId: number;
        speciality: {
          id: number;
          name: string;
          value: number;
        };
        userId: string;
        user: {
          firstName: string;
          lastName: string;
          phoneNumber: string | null;
          id: string;
        };
      };
      closestFreeDay: string;
}
