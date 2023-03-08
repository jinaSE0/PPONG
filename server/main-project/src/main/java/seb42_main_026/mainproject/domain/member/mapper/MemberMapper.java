package seb42_main_026.mainproject.domain.member.mapper;


import org.mapstruct.Mapper;
import seb42_main_026.mainproject.domain.member.dto.MemberDto;
import seb42_main_026.mainproject.domain.member.entity.Member;

@Mapper(componentModel = "spring")
public interface MemberMapper {

    Member memberPostToMember(MemberDto.Post memberPostDto);

    Member memberPatchToMember(MemberDto.Patch memberPatchDto);

    MemberDto.Response memberToMemberResponse(Member member);
}
