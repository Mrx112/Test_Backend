import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Profile } from '../schemas/profile.schema';
import { CreateProfileDto, UpdateProfileDto } from '../dtos/profile.dto';

interface ZodiacInfo {
  zodiacSign: string;
  dateRange: { start: string; end: string };
  horoscope: string;
}

@Injectable()
export class ProfileService {
  // Zodiac data with horoscopes
  private zodiacData: { [key: string]: ZodiacInfo } = {
    ARIES: {
      zodiacSign: 'Aries',
      dateRange: { start: '03-21', end: '04-19' },
      horoscope:
        'As an Aries, you are known for your bold, courageous, and pioneering spirit. You are a natural leader and tend to be enthusiastic about new adventures.',
    },
    TAURUS: {
      zodiacSign: 'Taurus',
      dateRange: { start: '04-20', end: '05-20' },
      horoscope:
        'As a Taurus, you are known for being reliable, patient, and practical. You have a strong appreciation for stability and comfort in your life.',
    },
    GEMINI: {
      zodiacSign: 'Gemini',
      dateRange: { start: '05-21', end: '06-20' },
      horoscope:
        'As a Gemini, you are known for your communication skills, curiosity, and adaptability. You have a quick mind and love to share ideas with others.',
    },
    CANCER: {
      zodiacSign: 'Cancer',
      dateRange: { start: '06-21', end: '07-22' },
      horoscope:
        'As a Cancer, you are known for being emotional, intuitive, and family-oriented. You are deeply caring and protective of those you love.',
    },
    LEO: {
      zodiacSign: 'Leo',
      dateRange: { start: '07-23', end: '08-22' },
      horoscope:
        'As a Leo, you are known for your confidence, creativity, and generosity. You love being in the spotlight and enjoy making others happy.',
    },
    VIRGO: {
      zodiacSign: 'Virgo',
      dateRange: { start: '08-23', end: '09-22' },
      horoscope:
        'As a Virgo, you are known for your attention to detail, analytical mind, and practical approach. You strive for perfection and are highly organized.',
    },
    LIBRA: {
      zodiacSign: 'Libra',
      dateRange: { start: '09-23', end: '10-22' },
      horoscope:
        'As a Libra, you are known for your diplomacy, balance, and love of harmony. You seek justice and fairness in all relationships.',
    },
    SCORPIO: {
      zodiacSign: 'Scorpio',
      dateRange: { start: '10-23', end: '11-21' },
      horoscope:
        'As a Scorpio, you are known for your intensity, passion, and determination. You are deeply perceptive and fiercely loyal to your loved ones.',
    },
    SAGITTARIUS: {
      zodiacSign: 'Sagittarius',
      dateRange: { start: '11-22', end: '12-21' },
      horoscope:
        'As a Sagittarius, you are known for your optimism, adventurous spirit, and love of freedom. You are a natural explorer and philosopher.',
    },
    CAPRICORN: {
      zodiacSign: 'Capricorn',
      dateRange: { start: '12-22', end: '01-19' },
      horoscope:
        'As a Capricorn, you are known for your ambition, discipline, and responsibility. You are a natural leader with strong organizational skills.',
    },
    AQUARIUS: {
      zodiacSign: 'Aquarius',
      dateRange: { start: '01-20', end: '02-18' },
      horoscope:
        'As an Aquarius, you are known for your independence, intellect, and humanitarian spirit. You are innovative and forward-thinking.',
    },
    PISCES: {
      zodiacSign: 'Pisces',
      dateRange: { start: '02-19', end: '03-20' },
      horoscope:
        'As a Pisces, you are known for your compassion, creativity, and intuition. You are deeply empathetic and artistic.',
    },
  };

  constructor(
    @InjectModel(Profile.name) private profileModel: Model<Profile>,
  ) {}

  /**
   * Get zodiac sign based on date of birth
   */
  private getZodiacSign(dateOfBirth: Date): string {
    const month = dateOfBirth.getMonth() + 1;
    const day = dateOfBirth.getDate();
    const dateString = `${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

    for (const [sign, data] of Object.entries(this.zodiacData)) {
      const [startMonth, startDay] = data.dateRange.start.split('-').map(Number);
      const [endMonth, endDay] = data.dateRange.end.split('-').map(Number);

      const currentDate = month * 100 + day;
      const startDate = startMonth * 100 + startDay;
      const endDate = endMonth * 100 + endDay;

      if (startDate <= endDate) {
        if (currentDate >= startDate && currentDate <= endDate) {
          return sign;
        }
      } else {
        if (currentDate >= startDate || currentDate <= endDate) {
          return sign;
        }
      }
    }

    return 'PISCES'; // Default fallback
  }

  /**
   * Create a new profile
   */
  async createProfile(userId: string, createProfileDto: CreateProfileDto) {
    // Check if profile already exists
    const existingProfile = await this.profileModel.findOne({
      userId: new Types.ObjectId(userId),
    });

    if (existingProfile) {
      throw new BadRequestException('Profile already exists for this user');
    }

    let zodiacSign = createProfileDto.zodiacSign;
    let horoscope = createProfileDto.zodiacSign
      ? this.zodiacData[createProfileDto.zodiacSign]?.horoscope || ''
      : '';

    // Auto-calculate zodiac if dateOfBirth is provided
    if (createProfileDto.dateOfBirth && !zodiacSign) {
      zodiacSign = this.getZodiacSign(new Date(createProfileDto.dateOfBirth));
      horoscope = this.zodiacData[zodiacSign]?.horoscope || '';
    }

    const profile = await this.profileModel.create({
      userId: new Types.ObjectId(userId),
      ...createProfileDto,
      zodiacSign,
      horoscope,
    });

    return this.formatProfileResponse(profile);
  }

  /**
   * Get user profile
   */
  async getProfile(userId: string) {
    const profile = await this.profileModel.findOne({
      userId: new Types.ObjectId(userId),
    });

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    return this.formatProfileResponse(profile);
  }

  /**
   * Update user profile
   */
  async updateProfile(userId: string, updateProfileDto: UpdateProfileDto) {
    const profile = await this.profileModel.findOne({
      userId: new Types.ObjectId(userId),
    });

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    // Update zodiac info if dateOfBirth is provided
    if (updateProfileDto.dateOfBirth) {
      const zodiacSign = this.getZodiacSign(
        new Date(updateProfileDto.dateOfBirth),
      );
      updateProfileDto.zodiacSign = zodiacSign;
    }

    // Update horoscope if zodiacSign is provided
    if (updateProfileDto.zodiacSign) {
      const horoscope =
        this.zodiacData[updateProfileDto.zodiacSign]?.horoscope || '';
      profile.horoscope = horoscope;
    }

    Object.assign(profile, updateProfileDto);
    profile.updatedAt = new Date();

    await profile.save();

    return this.formatProfileResponse(profile);
  }

  /**
   * Get profile by ID
   */
  async getProfileById(profileId: string) {
    const profile = await this.profileModel.findById(profileId);

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    return this.formatProfileResponse(profile);
  }

  /**
   * Format profile response (remove sensitive data if needed)
   */
  private formatProfileResponse(profile: any) {
    return {
      _id: profile._id,
      userId: profile.userId,
      displayName: profile.displayName,
      bio: profile.bio,
      height: profile.height,
      weight: profile.weight,
      zodiacSign: profile.zodiacSign,
      dateOfBirth: profile.dateOfBirth,
      horoscope: profile.horoscope,
      profileImageUrl: profile.profileImageUrl,
      galleryImageUrls: profile.galleryImageUrls,
      gender: profile.gender,
      location: profile.location,
      occupation: profile.occupation,
      education: profile.education,
      interests: profile.interests,
      favouriteGames: profile.favouriteGames,
      isPublic: profile.isPublic,
      createdAt: profile.createdAt,
      updatedAt: profile.updatedAt,
    };
  }
}
