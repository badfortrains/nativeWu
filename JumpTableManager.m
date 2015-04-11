//
//  JumpTableManager.m
//  nativeWu
//
//  Created by Sean Purcell on 4/10/15.
//  Copyright (c) 2015 Facebook. All rights reserved.
//

#import "JumpTableManager.h"
#import "JumpTable.h"

@implementation JumpTableManager

- (UIView *)view
{
    return [[JumpTable alloc] init];
}

RCT_EXPORT_VIEW_PROPERTY(dataBlob, NSDictionary);

@end
