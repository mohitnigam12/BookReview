using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using Data;
using Models.Dto;

namespace Services.Mapper
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile() 
        {
            CreateMap<Books, BookDto>()
                .ReverseMap();

            CreateMap<CreateBookDto, Books>();

            //CreateMap<Review, ReviewDto>()
            //    .ForMember(dest => dest.Username, opt => opt.MapFrom(src => src.User.UserName));
            CreateMap<CreateReviewDto, Review>()
               .ForMember(dest => dest.Rating, opt => opt.MapFrom(src => src.Rating))
               .ForMember(dest => dest.Comment, opt => opt.MapFrom(src => src.Comment))
               .ForMember(dest => dest.UserId, opt => opt.Ignore())
               .ForMember(dest => dest.BookId, opt => opt.Ignore())
               .ForMember(dest => dest.CreatedAt, opt => opt.Ignore());

            CreateMap<Review, ReviewDto>()
                .ForMember(dest => dest.Username, opt => opt.MapFrom(src => src.User != null ? src.User.UserName : "Anonymous"))
                .ForMember(dest => dest.Rating, opt => opt.MapFrom(src => src.Rating))
                .ForMember(dest => dest.Comment, opt => opt.MapFrom(src => src.Comment))
                .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => src.CreatedAt));

            CreateMap<CreateReviewDto, Review>();
        }
    }
}
