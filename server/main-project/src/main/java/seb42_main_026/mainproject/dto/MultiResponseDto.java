package seb42_main_026.mainproject.dto;

import lombok.Getter;
import org.springframework.data.domain.Page;

import java.util.List;

@Getter
public class MultiResponseDto<T> {
    private List<T> data;
    private PageInfo pageInfo;

    public MultiResponseDto(List<T> data, Page page){
        this.data = data;
        this.pageInfo = new PageInfo(page.getNumber() + 1, page.getSize(),
                pageInfo.getTotalElements(), page.getTotalPages());
    }
}